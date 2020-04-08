# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2020-04-07

### Changed

-   Using salat10 SDK for business logic.
-   Added more thorough unit-testing.
-   Restructured code environment to be deployed on a serverless function for faster startup time.
-   Added error message if user just sends `/bug` and `/address` commands by itself.
-   Fixed some potential crashes in the code.

### Changed

-   Added unit-tests.
-   Deal with DST.

## [1.0.3] - 2020-01-21

### Changed

-   Added unit-tests.
-   Deal with DST.

## [1.0.2] - 2020-01-20

### Changed

-   Fix logic for calculations so that it takes in the current date with UTC time, and does the calculations for tomorrow's date using UTC since sometimes Asr time date would be later than Last 1/3 night date.
-   Don't show seconds during time formatting.
-   Use native functions to format time instead of doing string manipulation.
-   Don't load Sentry and set webhook in development mode.

## [1.0.1] - 2020-01-20

### Changed

-   Fixed logic for tomorrow's calculations since it was not calculating 1/2 night and Last 1/3 night properly for regions of Mecca, Saudi Arabia and Nigeria.

## [1.0.0] - 2020-01-19

### Added

-   Shipped initial version of Telegram Bot and API.
