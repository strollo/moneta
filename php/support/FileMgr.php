<?php

/******************************************************************************
 * Module: support/FileMgr.php
 ******************************************************************************
 * Description:
 * Facilities for managing files / compression ...
 *
 * Usage:
 * 		FileMgr::create_zip($files...);
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';

class FileMgr {
	public static $log;
	
	static function init()
	{
		if (!self::$log) {
			self::$log = new Log('FileMgr');
		}
	}
	
	function unzip_file($file, $path) {
		$zip = new ZipArchive;
		$res = $zip->open($file);
		self::$log->info('Decompressing ' . $file . ' in ' . $path);
		if ($res === TRUE) {
		  $zip->extractTo($path);
		  $zip->close();
		  self::$log->info('Correctly decompressed ' . $file);
		} else {
			self::$log->err('Error in decompressing ' . $file);
		}
	}

	/* creates a compressed zip file */
	function create_zip($files = array(), $destination = null, $overwrite = false) {
		//if the zip file already exists and overwrite is false, return false
		if(file_exists($destination) && !$overwrite) { 
			return false; 
		}
	
		if (is_null($destination)) {
			$destination = tempnam(sys_get_temp_dir(), 'MonetaZIP') . '.zip';
		}
		
		self::$log->info('[ZIP] Creating zip for: ' . $files);
		self::$log->info('[ZIP] Destination file: ' . $destination);
	
		//vars
		$valid_files = array();
		//if files were passed in...
		if(is_array($files)) {
			//cycle through each file
			foreach($files as $file) {
				//make sure the file exists
				if((is_array($file) && file_exists($file[0])) || file_exists($file)) {
					self::$log->info('[ZIP] add: ' . $file);
					if (is_array($file)) {
						$valid_files[] = $file;
					} else {
						$valid_files[] = array($file, $file);
					}
				}
			}
		} else if (is_string($files)) {
			// a single file to compress
			if(file_exists($files)) {
				self::$log->info('[ZIP] add: ' . $files);
				$valid_files[] = $files;
			}
		}
		
		//if we have good files...
		if(count($valid_files)) {
			//create the archive
			$zip = new ZipArchive();
			if($zip->open($destination, $overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
				self::$log->info('[ZIP] Error in zip->open');
				return false;
			}
			//add the files
			foreach($valid_files as $file) {
				self::$log->info('[ZIP] +add: ' . $files);
				$zip->addFile($file[0], $file[1]);
			}
			self::$log->info( 'The zip archive contains ' . $zip->numFiles . ' file(s) with a status of ' . $zip->status );
			//close the zip -- done!
			$zip->close();
			
			//check to make sure the file exists
			return file_exists($destination);
		}
		else
		{
			self::$log->info('[ZIP] err');
			return false;
		}
	}

}

// Applies the initialization of static fields
FileMgr::init();
?>
