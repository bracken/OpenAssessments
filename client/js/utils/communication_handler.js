import $            from 'jquery';
import Communicator from '../utils/communicator';

export default {

  init: function(){
    Communicator.enableListener(this);
  },

  sendSize: function(){

    // TODO if we are calculating height this
    // way we might not need to use jquery at all.
    var height = Math.max(
            $(document).height(),
            document.body.scrollHeight, 
            document.body.offsetHeight,
            document.documentElement.clientHeight, 
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight);

    var payload = {
      height: height,
      width: $(document).width()
    };

    var ltiPayload = {
      subject: "lti.frameResize",
      height: height
    };

    // OEA specific message indicate the need for a resize
    Communicator.commMsg('open_assessments_resize', payload);
    // Let the LMS (Canvas) know about a resize
    Communicator.broadcastMsg(ltiPayload);
  },

  handleComm: function(e){
    switch(e.data.open_assessments_msg){
      case 'open_assessments_size_request':
        this.sendSize();
        break;
    }
  }

};
