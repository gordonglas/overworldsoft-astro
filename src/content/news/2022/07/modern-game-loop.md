---
title: The modern game-loop
description: The modern game-loop
slug: 2022/07/modern-game-loop
pubDate: 2022/07/25
tags:
  - Game Dev
  - Game Engine
  - C++
published: true
---

When you're coding a game-loop in C/C++ for Windows, the first code you'll probably come across will be something like the following:

```cpp
while(1) {
  // while Windows messages are in the message queue...
  while(PeekMessage(&msg, NULL, 0, 0, PM_REMOVE)) {
    // ...translate and send them to the Window Procedure
    TranslateMessage(&msg);
    DispatchMessage(&msg);

    // Important to have this here also.
    // WM_QUIT may not be the last message.
    // I've seen WM_TIMER sent from OTHER apps come AFTER it.
    if(msg.message == WM_QUIT)
      break;
  }

  if(msg.message == WM_QUIT)
    break;

  // run game code here
}
```

You'll quickly be told that this doesn't run the same speed on all computers, so next you'll probably see what is called a `variable time-step` game-loop. The basic idea being that moving your objects will be based on the amount of time it took to run one iteration of your game loop. For example, like this:

```cpp
float lastTime = GetCurrentTime();
float currentTime, elapsedTime;
while(1) {
  // while Windows messages are in the message queue...
  while(PeekMessage(&msg, NULL, 0, 0, PM_REMOVE)) {
    // ...translate and send them to the Window Procedure
    TranslateMessage(&msg);
    DispatchMessage(&msg);

    // Important to have this here also.
    // WM_QUIT may not be the last message.
    // I've seen WM_TIMER sent from OTHER apps come AFTER it.
    if(msg.message == WM_QUIT)
      break;
  }

  if(msg.message == WM_QUIT)
    break;

  currentTime = GetCurrentTime();
  elapsedTime = lastTime - currentTime;

  // use elapsedTime to adjust movement of your game objects,
  // for example, the player's character:
  playerCharacter.xPosition += moveX * elapsedTime;
  playerCharacter.yPosition += moveY * elapsedTime;

  // more game code here
}
```

This will work for the most part, and a lot of engines still use this, but it can cause some serious problems when it comes to your physics engine. You've probably seen games where objects explode WAY off the screen, obviously a lot farther then they should have. A variable time-step loop like this could be the culprit. The problem has to do with floating point accuracy/approximation issues. The other problem is, it's very hard to reproduce/test the same behavior again, because of the varying time in each loop. This can also present problems in networking / multiplayer code.

Having started writing game code in the 90's, the variable time-step loop was very common and it's what I used for many years. It's also very easy to code and understand. But perhaps a better, more-modern game-loop would be what's called a `fixed time-step` loop. I won't go into the details here, because there are already some great posts on the subject, so I highly recommend reading through the [game-loop pattern](https://gameprogrammingpatterns.com/game-loop.html) to learn more (part of the great book [Game Programming Patterns](https://gameprogrammingpatterns.com) by Bob Nystrom.)
