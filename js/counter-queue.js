class counterQueue{

    queue = Array();
    options = Object();
    current = "VTube Time Over";
    reverse = 0;
    interval;
    
    constructor(){

        /*$.getJSON("settings.json",
            function (data) {
                this.options = data;
                console.log(JSON.stringify(this.options));
            }
        );*/
        //console.log(this.queue);
        this.options = {
            "maxQueueLength":5, // maximum size of VISIBLE queue
            "waitTillAction":5, // delay until action applies (in seconds)
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
        /*
        this.queue = [
            {"claiment":"tom", "action":"deactivate"},
            {"claiment":"bob", "action":"activate"},
            {"claiment":"jack", "action":"activate"},
            {"claiment":"mike", "action":"deactivate"},
            {"claiment":"josh", "action":"deactivate"},
        ];
        */
        this.interval = setInterval(this.queueTick.bind(this),8000);
    }

    queueTick()
    {
        //console.log("----------------------------");
        //console.log("STATUS: "+this.current);
        if(Array.isArray(this.queue) && this.queue.length >= 1)
        {
            var top = this.queue.pop();
            //console.log("claiment: "+top.claiment+" action: "+top.action);
            if(top.action != this.options.reversalAction)
            {
                if(this.reverse < 1 || (this.reverse >= 2 && this.reverse % 2 == 0))
                {
                    if(top.action == this.options.positiveAction)
                        this.current = this.options.positiveTitle;
                    if(top.action == this.options.negativeAction)
                        this.current = this.options.negativeTitle;
                    this.reverse = 0;
                }
                else if(this.reverse >= 1 && this.reverse % 2 == 1)
                {
                    if(top.action == this.options.positiveAction)
                        this.current = this.options.negativeTitle;
                    if(top.action == this.options.negativeAction)
                        this.current = this.options.positiveTitle;

                    $("#reverse-card").show(1000);
                    $("#reverse-card").hide(50);
                    this.reverse = 0;
                }
                //console.log("current: "+this.current+" flip: "+this.reverse);
                this.updateGUI();
                
                //setTimeout(this.queueTick(),10000); 
                return;
            }
            if(top.action == this.options.reversalAction)
            {
                this.reverse++;
                $("#reverse-card").show();
                $("#reverse-card").hide(3000);

                this.updateGUI();
                //console.log("current: "+this.current+" flip: "+this.reverse);
                //setTimeout(this.queueTick(),3000); 
                return;
            }
            
        }
        //setTimeout(this.queueTick(),10000);
        return;
    }

    updateGUI()
    {
        $("#vtguistack").empty();
        if(this.queue.length > 0)
        {
            var i;
            for(i = this.queue.length - 1; i > 0 ; i--)
            {
                var clmnt = $("<td></td>").text(this.queue[i].claiment);
                var actn = $("<td></td>").text(this.queue[i].action);
        
                var row = $("<tr></tr>").append(clmnt,actn);

                $("#vtguistack").append(row);
            }
        }
        $("#current-action").text(this.current);
    }

    queueAdd(claiment, action)
    {
        if(action == this.options.reversalAction)
        {
            this.queue.push({"claiment":claiment, "action":this.options.reversalAction});
        }
        else if(action == this.options.positiveAction)
        {
            this.queue.unshift({"claiment":claiment, "action":this.options.positiveAction});
        }
        else if(action == this.options.negativeAction)
        {
            this.queue.unshift({"claiment":claiment, "action":this.options.negativeAction});
        }
        
        this.updateGUI();
        return;
    }
}