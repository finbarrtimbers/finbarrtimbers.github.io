# Overview

My presentation for [UseR! 2016](user2016.org).

## Abstract

As consultants, many of the projects that we work on are similar, with many
steps repeated verbatim across projects. Previously, our workflow was based
largely in Microsoft Office, with our analysis done manually in Excel, our
reports written in Word, and our presentations in Powerpoint. In 2015, we began
using R for much of our analysis, including making slide decks and reports in
RMarkdown. Our presentation discusses why we made the change, how we managed it,
and advice for other consulting firms looking to do the same.

## Dependencies
- `RMarkdown`
- `ggplot2`
- `ggthemes`

## Usage

1. Download the code with

    `$ git clone https://bitbucket.org/timbers/user-2016-slides`

2. Install the dependencies in the R REPL with

    `> install.packages('RMarkdown')`

3. Build the presentation with

    `$ make automating-your-work-away.html`

## Credits

- [Darkhorse Analytics](dha.io) for supporting me to attend UseR!2016.
