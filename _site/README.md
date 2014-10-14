[Analytics](http://skyglobal.github.io/analytics) [![Build Status](https://circleci.com/gh/skyglobal/analytics.png?circle-token=ffbea17cf5fdf1c09f4fb53cf5fa1db6c804c832)](https://circleci.com/gh/skyglobal/analytics)
=========

BSkyB wrapper for Adobe Analytics (previously known as SiteCatalyst) analytics JS.

## Building Analytics Locally
### Prerequisites

- Ideally a Ruby version manager like [RBenv](http://rbenv.org/)
- [Ruby](https://www.ruby-lang.org/en/) (version 1.9.3 or later)
- [node](http://nodejs.org/) 
- [phantomjs](http://phantomjs.org/) 
- [Grunt](http://gruntjs.com/)

### Setup
1. Fork the repository from Github onto your local machine
2. Install ruby requirements
  - bundle
3. Install node requirements
  - npm install

### Code structure
- grunt/js/
  The source code, unminified and ready to work on.

- grunt/js/analytics.js
  The public API is created here (returned at the bottom). This file brings together files from /core, /plugins and /utils.

- grunt/js/demo.js
  JS to make the demo page work.  This JS is also used as part of the unit testing.

- grunt/sass/
  The look and feel for the wiki pages.

- dist/
  Compiled code (via grunt)

- _includes/
  Source documentation for using the API.

- _site/
  Compiled documentation (via jekyll) for using the API.

- app.rb
  A basic Sinatra server for running the functional tests

- test/
  the functional + unit tests for the API

- circle.yml
  Configuration for the CI server

- config.ru
  Configuration for running the Sinatra server

- Gruntfile.js
  Configuration for grunt tasks - to do with compiling the javascript

### Running

1. In the root of the project, run the following:
  - `jekyll serve --watch`
2. In another terminal run:
  - `grunt watch` (add ' --beautify' to help debugging)
3. browse to
  - http://localhost:4001

### Testing
These tests are automatically run on the CircleCI server upon pushing to Github
  - `grunt test`
    - functional using minitest and capybara
    - unit using [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/‎)


### Deployment
To release a new version with:
  - Code changes -  increment the version number (described below) in _config.yml. This will update gh-pages and the S3.
  - Documentation changes - Dont increment the version number. This will update gh-pages branch only.
  - Release Candidate changes - Add 'rc' to the end of the version number e.g. '1.0.1rc2'. this will update the S3 only

#### Versioning
This library should follow the [Semantic versioning
specification](http://semver.org/). In short, that means the following:

Version: X.Y.Z

- API changes that are **not backwards compatible**, and break existing
  calls using the API must increment the X value.

- API changes that introduce **new backwards compatible changes**, or **change the
  internals**, but not the interface, of existing methods will increment the
  Y value.

- **Patches or bug fixes** that are backwards compatible should increment the
  Z value.


Upon commiting and pushing your code to Github, the CI server will run through
the functional tests and - if there are no errors - a new version of the library
will be deployed to the CDN using the version number specified in the
_config.yml file.
