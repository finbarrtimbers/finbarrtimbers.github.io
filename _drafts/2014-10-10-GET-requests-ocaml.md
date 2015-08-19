---
layout: post
title: GET requests in OCaml
tags: OCaml http
---

I've been working a lot lately in OCaml, which is a strongly typed, static,
functional language. It is most famously used by [Jane Street](
https://www.janestreet.com/), a quantitative trading firm out of New York.
I like OCaml for a number of reasons, but the biggest one is that the language
has very good type inference, as good as Haskell. Consequently, you can write
code that reads like Python, but refactors like C++. I find that I'll write code
without the type annotations, and then go back and add them once it's done, which
makes refactoring surprisingly easy.

One of the most important tasks that the code does is
get updates for the prices of the securities in our portfolio. I do so via a
get request to the [`markitondemand.com`](http://dev.markitondemand.com/) API.

I found it shockingly difficult to perform a simple get request in OCaml, so
I'm going to provide a detailed guide on how to do so here, and provide
example code, as well as the commands to compile it. 

1. Download the source from github. In the directory that you want to install the source code into, enter

        git clone https://github.com/open-source-parsers/jsoncpp
        cd jsoncpp

2. Create the makefiles. For this step, you must have cmake installed; if it is not installed, you can install it with your system package manager. [1] From jsoncpp/, run

        mkdir -p build/debug
        cd build/debug
        cmake -DCMAKE_BUILD_TYPE=debug -DJSONCPP_LIB_BUILD_SHARED=OFF -G "Unix Makefiles" ../../../jsoncpp
        make
        cd ../..

3. Enter `pwd` and make a note of the output. Now, go to the folder containing the code in which you want to use JSONcpp in. Create a new file called "example.cpp" and enter the following code (taken from Stack Overflow):

        #include <fstream>
        #include <iostream>   
        #include "json/json.h"

        int main() {
            Json::Value root;
            std::ifstream file("test.json");
            file >> root;
            std::cout << root;
        }

Create another file called "test.json" with the json content you want to read; I used

        {"stocks": [{"symbol": "AAPL",
                     "amount": 1.03213,
                     "last_price": 1.20},
                    {"symbol": "MSFT",
                     "amount": 2.31039},
                    {"symbol": "F",
                     "amount": 0.543589}]}

4. Compile the code using a "Makefile." Using your favourite text editor, create a file called "Makefile" and enter the following code (replacing `JSONCPPPATH` with the results from running `pwd` earlier; mine looks like `/Users/ft/Source/jsoncpp/`):

        CXX = g++
        LDFLAGS = -LJSONCPPPATH/build/debug/lib -ljsoncpp
        INC = -IJSONCPPPATH/include

        main: main.cpp
            $(CXX) -o main $(LDFLAGS) $(INC) main.cpp

IMPORTANT: you have to indent the `$(CXX) -o main...` line with 1 TAB and not 4 SPACES or it won't work. GNU Make requires a tab for indentation.

5. Now, compile the code by running `make main`. You should now be able to run the code by entering `./main`. It will print the contents of your `test.json` file to your terminal.

[jsoncpp]: https://github.com/open-source-parsers/jsoncpp "JSONcpp on github"
[1]: On OS X, I use Homebrew, and on (e.g.) Ubuntu, the package manager is apt-get. On OS X, you would enter `brew install cmake` to install cmake, while on Ubuntu, you would run `apt-get install cmake`.
