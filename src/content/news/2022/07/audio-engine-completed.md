---
title: Audio engine completed
description: Audio engine completed
slug: 2022/07/audio-engine-completed
pubDate: 2022/07/24
tags:
  - Game Dev
  - Game Engine
  - C++
published: true
---

I've gotten back into working on my C++ game engine (targeting Windows for now, but written in a cross-platform-ish way), and I've basically got the audio engine completed for now.

I first started out by getting static `wav` files working (for short sound FX), as well as supporting many mod file formats via [libopenmpt](https://lib.openmpt.org/libopenmpt/), and then playing through [XAudio2](https://docs.microsoft.com/en-us/windows/win32/xaudio2/xaudio2-introduction), then I realized I won't realistically be using mod file formats, so I trashed it and got [streaming ogg files](https://xiph.org/vorbis/doc/vorbisfile/overview.html) working through XAudio2 instead. Then I said, "why should I use uncompresed wav files for sound FX, when I can just use compressed `ogg`?", so I trashed the wav code and now use ogg for everything: sound FX, music, and ambiance.

To make music tracks, I'll be using soundfonts similar to those used in SNES games, within [FL Studio](https://www.image-line.com/fl-studio/) (AKA `Fruity Loops`).

I've absolutely *loved* working on the Audio engine. It's one of my favorite parts to code, which is why I worked on it so early in my engine development. I had a lot of fun learning [PCM format](https://en.wikipedia.org/wiki/Pulse-code_modulation) and how to stream it through the relatively simple and robust XAudio2 lib. One great book that helped with PCM format (and how digital audio works in general) is [The Audio Programming Book](https://mitpress.mit.edu/books/audio-programming-book). Highly recommended. For learning XAudio2, I just used the [XAudio2 official documentation](https://docs.microsoft.com/en-us/windows/win32/xaudio2/xaudio2-introduction).

I ran into a couple bigger problems (among others):

The first problem was that I was running my `audio stream update` function in a separate thread from the game thread (which is also the main/ui thread of the game). As I started to think of how the rest of the engine systems will work, I quickly realized that handling the other engine systems in a different thread than the audio update function will mean a lot of thread synchronization, which means locking, which means framerate will likely suffer. Lock-free programming can be challenging to get right, and I don't want to deal with oddball race-conditions causing crashing, so I ended up moving my audio stream update function to run in the main thread. This removes having to handle thread synchronization at all and really simplifies things, and the XAudio2 backend already runs in it's own thread-safe thread anyway. But running the entire gameloop in the main thread created a new problem...

The second problem was, because I moved the game loop (and audio update function) all into the main thread, now when you drag the window's title bar, doing so runs code in it's *own* internal message loop, so the main windows message loop doesn't get *any* CPU time. In terms of the audio engine, this results in the audio update function (as well as any other game update system) not getting called at all. Obviously this won't work, so I fixed this by moving the *entire* game loop into it's own thread. This works very cleanly and seems to be a great way to handle `separation of concerns`, which is one primary reason for putting code in a separate thread according to the great book [C++ Concurrency in Action](https://www.manning.com/books/c-plus-plus-concurrency-in-action-second-edition).  This has it's own challenges though, as some of the input handling code will still need to come from the Windows Procedure (keyboard events) which must run in the main thread, so there will still need to be some form of thread synchronization. There are always tradeoffs. However, I did figure out a nice way to use a Windows [Critical Section](https://docs.microsoft.com/en-us/windows/win32/sync/critical-section-objects) in combination with a lock-free `std::atomic<bool>` to be able to effciently pass the input events from the main thread to the game loop thread.

Now that the Audio engine is basically done (at least to the point where I want it for now), next up is the Input engine. [Scan-codes](https://kbdlayout.info/kbdusx/scancodes), [Key messages](https://docs.microsoft.com/en-us/windows/win32/learnwin32/keyboard-input), [JoyShockLibrary](https://github.com/JibbSmart/JoyShockLibrary), and [XInput](https://docs.microsoft.com/en-us/windows/win32/xinput/getting-started-with-xinput), here I come.
