define("ClientController", ["jquery", "handlebars", "TextClientController", "TextServerController", "TypingIndicatorController", "InputMCController", "InputListController", "LocalProjectController", "text!/client/views/client.html"],
function($, Handlebars, TextClientController, TextServerController, TypingIndicatorController, InputMCController, InputListController, LocalProjectController, view) {

  return class ClientController {

    constructor() {
      var self = this;
      this.dom = undefined;
      this.project = undefined;
      this.current_type = undefined;
      this.current_params = undefined;

      this.background_client = '#C42E51';

      require(['jqueryui'], function() {
          require(['jqueryuitouch'], function() {
            self.clientTemplate = Handlebars.compile(view);
            self.render();
            self.bindEvents();
            self.typingIndicator = new TypingIndicatorController();
            self.inputMC = new InputMCController();
            self.inputMC.subscribe(self);
            self.inputList = new InputListController();

            // Temporary fix to check whether we are in an iFrame.
            // If not (stand-alone), use remote project manager
            /*if (window.self == window.top) {
              self.projectcontroller = new RemoteProjectController();
              self.projectcontroller.subscribe(self);
            }*/

          });
      });

    }

    bindEvents() {
      this.dom.on('keypress', { self: this }, this.key_pressed);

      $(window).on('message', { self: this }, this.project_received);

      $('#send_icon').on('click', { self: this}, this.post_message);

      /*$(document).keydown(function (e) {
          if(e.keyCode == 16) shiftDown = true;
      });

      $(document).keyup(function (e) {
          if(e.keyCode == 16) shiftDown = false;
      });*/
    }

    render() {
      this.dom = $(this.clientTemplate());
      $('#client_container').append(this.dom);
    }

    key_pressed(event) {
      console.log(event);
      if (!event.shiftKey && event.keyCode == 13) { // Enter -> submit!
        event.preventDefault(); // prevent another \n from being entered
        event.data.self.post_message(event);
      }
    }

    post_message(event) {
      var msg = '';
      if (event.data.self.current_type == 'MC') {
        msg = event.data.self.inputMC.selected;
      }
      else if (event.data.self.current_type == 'List') {
        if (event.data.self.current_params.number_input && $('#input_select_number').val() != '') {
          msg += $('#input_select_number').val() + ' ';
        }
        if (event.data.self.current_params.text_input && $('#input_select_text').text() != '') {
          msg += $('#input_select_text').text() + ' ';
        }
        msg += event.data.self.inputList.selected;
      }
      else {
        var msg = $("#input_field").html().replace(/<div>/gi,'<br>').replace(/<\/div>/gi,'').replace('<br><br><br>', '<br><br>');
      }

      if (msg != '') {
        new TextClientController({ msg: msg, background_color: event.data.self.background_client});
        $("#input_field").empty();
        setTimeout(function() { $("body").scrollTop($("body")[0].scrollHeight); }, 10);
        event.data.self.projectcontroller.receive_message(msg);

        event.data.self.hide_all_inputs();
        $('#input_field').show();
        event.data.self.current_type = undefined;
        event.data.self.current_params = undefined;
      }

    }

    project_received(event) {
      // Temp demo code
      $('#messages').empty();

      // Clear all ongoing timers (https://stackoverflow.com/questions/3847121/how-can-i-disable-all-settimeout-events)
      // Set a fake timeout to get the highest timeout id
      var highestTimeoutId = setTimeout(";");
      for (var i = 0 ; i < highestTimeoutId ; i++) {
          clearTimeout(i);
      }

      // Reset input to text
      event.data.self.hide_all_inputs();
      $('#input_field').show();


      event.data.self.projectcontroller = new LocalProjectController(event.originalEvent.data);
      event.data.self.projectcontroller.subscribe(event.data.self);
    }

    notify(src, message, params) {

      switch(message) {
        case 'chatbot_message': this.handle_message(params.type, params.content, params.params); break;
        case 'option_selected': this.post_message({data: {self: this}});
        default: ;
      }

    }

    hide_all_inputs() {
      $('#input_field').hide();
      this.inputMC.hide();
      this.inputList.hide();
    }

    handle_message(type, content, params) {
      var self = this;

      // Send the message
      this.typingIndicator.show();

      // @TODO: make typing indicator optional
      setTimeout(function() {
        self.typingIndicator.hide();
        self.send_message(type, content, params);
        self.projectcontroller.message_sent_event();
      }, content.length / 15 * 1000);
    }

    send_message(type, content, params) {
      var self = this;
      this.current_type = type;
      this.current_params = params;

      new TextServerController({ msg: content, background_color: this.background_client});
      setTimeout(function() { $("body").scrollTop($("body")[0].scrollHeight); }, 10);


      this.hide_all_inputs();

      // Set the right input modality
      if (type == 'MC') {
        console.log(params.options);
        this.inputMC.redraw(params.options);
        this.inputMC.show();
      }
      else if (type == 'List') {
        console.log(params.options);
        this.inputList.redraw(params);
        this.inputList.show();
      }
      else {
        $('#input_field').show();
      }
    }

  }

});
