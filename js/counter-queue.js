// not the cleanest implementation of this idea, but should be easier to read than the slim version.
class counterQueue{

    queue = Array();
    options = Object();
    current = "VTube Time Over";
    reverse = 0;
    interval;
    
    constructor(){

        /*$.getJSON("settings.json", // If you're hosting this feel free to include the settings.json instead of the below settings
            function (data) {
                this.options = data;
                console.log(JSON.stringify(this.options));
            }
        );*/
        //console.log(this.queue);
        this.options = {
            "maxQueueLength":5, // maximum size of VISIBLE queue (NOT IMPLEMENTED)
            "waitTillAction":8, // delay until action applies (in seconds)
            "positiveAction":"activate", // text to look for when triggering the positive action
            "negativeAction":"deactivate", // text to look for when triggering the negative action
            "reversalAction":"reverse", // text to look for when triggering the negation action
            "positiveTitle":"V-Tube Time", // text to be displayed in the table for the positive action
            "negativeTitle":"V-Tube Time Over", // text to be displayed in the table ...
            "reversalTitle":"V-Tube Flip" // text to be displayed in the table ...
        }
        $("#reverse-card").hide();
        //console.log(JSON.stringify(this.options));
    }

    startQueueTick()
    {
        /* some more test cases if you need them in the starting function
        this.queue = [
            {"claiment":"tom", "action":"deactivate"},
            {"claiment":"bob", "action":"activate"},
            {"claiment":"jack", "action":"activate"},
            {"claiment":"mike", "action":"deactivate"},
            {"claiment":"josh", "action":"deactivate"},
        ];
        */
        this.interval = setInterval(this.queueTick.bind(this),(this.options.waitTillAction * 1000)); // sets the queue to tick
    }

    queueTick()
    {
        //console.log("----------------------------"); // debug
        //console.log("STATUS: "+this.current); // debug
        if(Array.isArray(this.queue) && this.queue.length >= 1) // there is more queue to execute?
        {
            var top = this.queue.pop(); // take the last element out of the queue to act on it.
            //console.log("claiment: "+top.claiment+" action: "+top.action); // debug
            if(top.action != this.options.reversalAction) // is it NOT a reversal action?
            {
                if(this.reverse < 1 || (this.reverse >= 2 && this.reverse % 2 == 0)) // there's an even number of stacked reverses
                {
                    // do what the action says
                    if(top.action == this.options.positiveAction)
                        this.current = this.options.positiveTitle;
                    if(top.action == this.options.negativeAction)
                        this.current = this.options.negativeTitle;
                    this.reverse = 0;
                }
                else if(this.reverse >= 1 && this.reverse % 2 == 1) // there's an odd number of stacked reverses
                {
                    // do the opposite of what the action says
                    if(top.action == this.options.positiveAction)
                        this.current = this.options.negativeTitle;
                    if(top.action == this.options.negativeAction)
                        this.current = this.options.positiveTitle;

                    $("#reverse-card").show(1000); // show the reverse card being used
                    $("#reverse-card").hide(50);
                    this.reverse = 0;
                }
                //console.log("current: "+this.current+" flip: "+this.reverse); // debug
                this.updateGUI(); // update the GUIstack
                
                return;
            }
            if(top.action == this.options.reversalAction)
            {
                this.reverse++; // we've added a reverse to the reverse stack
                $("#reverse-card").show(); // show us putting the reverse card down as a trap
                $("#reverse-card").hide(3000);

                this.updateGUI(); // update the GUIstack
                //console.log("current: "+this.current+" flip: "+this.reverse); // debug
                return;
            }
            
        }
        return;
    }

    updateGUI()
    {
        $("#vtguistack").empty(); // clear the existing stack
        if(this.queue.length > 0) // make sure the queue isn't empty
        {
            var i;
            for(i = this.queue.length - 1; i > 0 ; i--) // reverse for iteration loop since the front needs to be the top of the GUI stack
            {
                var clmnt = $("<td></td>").text(this.queue[i].claiment); // add css to the table row details here if you need
                var actn = $("<td></td>").text(this.queue[i].action); // ""
        
                var row = $("<tr></tr>").append(clmnt,actn); // ""

                $("#vtguistack").append(row);
            }
        }
        $("#current-action").text(this.current);
    }

    queueAdd(claiment, action)
    {
        if(action == this.options.reversalAction)
        {
            this.queue.push({"claiment":claiment, "action":this.options.reversalAction}); // push instead of unshift for reverse because we want that to go first every time
        }
        else if(action == this.options.positiveAction)
        {
            this.queue.unshift({"claiment":claiment, "action":this.options.positiveAction}); // unshift the new action to the back
        }
        else if(action == this.options.negativeAction)
        {
            this.queue.unshift({"claiment":claiment, "action":this.options.negativeAction}); // unshift the new action to the back
        }
        
        this.updateGUI(); // this is kind-of optional since the GUI will refresh every 10s anyways
        return;
    }
}