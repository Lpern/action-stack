Test for possible twitch rewards queueing (VTube in this example)

To make changes you just need to adjust them in the counter-queue.js (not the settings.json unless you're going to host it yourself and redirect to that)

Way it works: ticks down one of the reward actions every 10 seconds [or however many seconds you chose via the "waitTillAction" variable in the javascript (gives chat users time to play the reverse action).

when a reverse card is played it goes to the front of the queue immediatelly before the next action is consumed, and will played against the next non-reverse action.

reverse actions will also negate other reverse actions... so:

vtube activate -> current: active
vtube reverse -> current: active (applies to NEXT non-reverse action)
vtube reverse -> current: active (but now there are 2 reverses to apply)
vtube deactivate -> current: inactive (one reverse would have kept it active, but two went back around to deactivation)

the next non-reverse action will clear all the reverse actions accumulated.  