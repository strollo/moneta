HTMLPanel = Ext.extend(Ext.Panel, {
    constructor : function( config ) {
        HTMLPanel.superclass.constructor.apply(this, arguments);
		this.autoScroll = true;
    },
	
	setPageURL: function(url) {
		this.url = url;
		var me = this;
		if( this.url && (this.url.length > 0) )
		{
			Ext.Ajax.request({
				url : this.url,
				method : "GET",
				success : function( response, request ) {
					me.update(response.responseText);
				},
				failure : function( response, request ) {
					//console.log("failed: " + response.responseText);
				}
			});
		}
	},
    
    url : null
});	