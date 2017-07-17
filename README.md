# Nextdeploy-Webui

Webui  for [nextdeploy project](https://github.com/ricofehr/nextdeploy)
The Web Ui is developed with Ember framework.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `npm install -g ember-cli` globally install Ember CLI
* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

The webui will be available at [http://localhost:4200](http://localhost:4200).
```
$ ember serve

Livereload server on http://localhost:35722
Serving on http://localhost:4200/

Build successful - 66201ms.

Slowest Trees                                 | Total
----------------------------------------------+---------------------
Babel                                         | 16570ms
Babel                                         | 10378ms
Babel                                         | 4182ms
Babel                                         | 3580ms

Slowest Trees (cumulative)                    | Total (avg)
----------------------------------------------+---------------------
Babel (25)                                    | 46028ms (1841 ms)
```

5 Mock users with password "word123123"
* "usera@os.nextdeploy" (admin)
* "userl@os.nextdeploy" (Lead)
* "userd@os.nextdeploy" (Developper)
* "userp@os.nextdeploy" (Project Manager)
* "userg@os.nextdeploy" (Guest)

### Building

* `ember build -e production|development`

## YUIDOC

Generates YUIDOC documentation into /docs folder
```
$ ember ember-cli-yuidoc
info: Scanning for yuidoc.json file.
warn: Skipping node_modules directory while scanning for yuidoc.json
info: Loading package.json data from: package.json
info: Loading yuidoc.json data from: yuidoc.json
```
