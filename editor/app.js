requirejs.config({
    baseUrl: '/',
    paths: {
        // External libraries
        text: 'vendor/text',
        handlebars: 'vendor/handlebars.min-v4.7.7',
        jquery: 'vendor/jquery-3.6.0.min',
        jqueryui: 'vendor/jquery-ui-1.13.1.custom/jquery-ui.min',
        jqueryuitouch: 'vendor/jquery.ui.touch-punch.min',
        html2canvas: 'vendor/html2canvas.min',

        // Shared modules
        Util: 'util',

        // Controllers
        Observable: 'controllers/observable',
        EditorController: 'editor/controllers/editor',
        StartingPointController: 'editor/controllers/starting_point',
        MinimapController: 'editor/controllers/minimap',
        NewBlockController: 'editor/controllers/new_block',
        EditBlockController: 'editor/controllers/edit_block',
        BlockController: 'editor/controllers/block',
        LineController: 'editor/controllers/line',
        BasicProjectController: 'editor/controllers/basicproject',

        // Models
        Project: 'models/project',
        BasicBlock: 'models/basicblock',
        AutoBlock: 'models/blocks/autoblock',
        MCBlock: 'models/blocks/mcblock',
        TextBlock: 'models/blocks/textblock',
        ListBlock: 'models/blocks/listblock',
        BasicConnector: 'models/basicconnector',
        LabeledConnector: 'models/connectors/labeledconnector'
    }
});

requirejs(["editor/controllers/main"]);
