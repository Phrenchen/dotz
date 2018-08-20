this is a playground project where I fool around with something I call a "game" although far from resembling anything like a complete game. 
wip :)

developed in TypeScript

libs & tools
- React and Redux
- PixiJS
- NPM and Webpack



feature roadmap
- add replay playback
- unit behaviour: after collecting x food units die of "overconsumption" (lemming behaviour)
- basic game mechanic:
    - each player has a time budget of x seconds per match
    - swarm size scales as you extend the duration of the touch (add y units / seconds)

    challenge for the player:
        - decide when and where to dispatch how many units
            - advantages / disadvantages of early units dispatch: 
                + find food easily
                + less enemy units competing for resource
                - less flexibility later in the match