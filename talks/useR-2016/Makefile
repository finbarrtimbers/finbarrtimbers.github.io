sources :=         $(wildcard *.Rmd)
slides :=         $(sources:.Rmd=.pdf)

all:            ${slides}

%.pdf:            %.Rmd assets/*
			Rscript -e "rmarkdown::render(\"$<\", clean=TRUE)"

%.html:            %.Rmd
			Rscript -e "rmarkdown::render(\"$<\", clean=TRUE, rmarkdown::html_document())"


clean:
	rm -f docker-demo.pdf
