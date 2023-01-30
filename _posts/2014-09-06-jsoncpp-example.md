---
layout: page
title: Full example for using JSONcpp on Unix
tags: c++ json example
---

I've been trying to parse JSON files with C++, and I've found a distinct lack of
full examples on how to do so. Specifically, I've struggled to find the proper
commands to actually compile the code. For future reference (and to help any
beginners out), here's a full example of how to use [JSONcpp][jsoncpp] in your code (N.B. You're supposed to enter all of the following code in your terminal).

1. Download the source from github. In the directory that you want to install the source code into, enter


        git clone https://github.com/open-source-parsers/jsoncpp
        cd jsoncpp


2. Create the makefiles. For this step, you must have cmake installed; if it is not installed, you can install it with your system package manager. [1] From jsoncpp/, run


        mkdir -p build/debug
        cd build/debug
        cmake -DCMAKE_BUILD_TYPE=debug -DJSONCPP_LIB_BUILD_SHARED=OFF -G "Unix Makefiles" ../../../jsoncpp
        make
        cd ../..


3. Enter `pwd` and make a note of the output. Now, go to the folder containing the code in which you want to use JSONcpp in. Create a new file called "main.cpp" and enter the following code (taken from Stack Overflow):


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


        {
            "stocks": [
                {"symbol": "AAPL",
                 "amount": 1.03213,
                 "last_price": 1.20},
                {"symbol": "MSFT",
                 "amount": 2.31039},
                {"symbol": "F",
                 "amount": 0.543589}
                 ]
         }


4. Compile the code using a "Makefile." Using your favourite text editor, create a file called "Makefile" and enter the following code (replacing `JSONCPPPATH` with the results from running `pwd` earlier; mine looks like `/Users/ft/Source/jsoncpp/`):


        CXX = g++
        LDFLAGS = -LJSONCPPPATH/build/depug/src/lib_json -ljsoncpp
        INC = -IJSONCPPPATH/include

        main: main.cpp
            $(CXX) -o main $(LDFLAGS) $(INC) main.cpp


    IMPORTANT: you have to indent the `$(CXX) -o main...` line with 1 TAB and not 4 SPACES or it won't work. GNU Make requires a tab for indentation.

5. Now, compile the code by running `make main`. You should now be able to run the code by entering `./main`. It will print the contents of your `test.json` file to your terminal.

[jsoncpp]: https://github.com/open-source-parsers/jsoncpp "JSONcpp on github"
[1]: On OS X, I use Homebrew, and on (e.g.) Ubuntu, the package manager is apt-get. On OS X, you would enter `brew install cmake` to install cmake, while on Ubuntu, you would run `apt-get install cmake`.
