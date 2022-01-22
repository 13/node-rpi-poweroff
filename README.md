# node-rpi-poweroff

Poweroff & reboot Raspberry Pi over HTTP and button

## Contents

 * [About](#about)
   * [Built With](#built-with)
 * [Getting Started](#getting-started)
   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
 * [Usage](#usage)
 * [Troubleshooting](#troubleshooting)
 * [Roadmap](#roadmap)
 * [Release History](#release-history)
 * [License](#license)
 * [Contact](#contact)
 * [Acknowledgements](#acknowledgements)

## About

A NodeJS Linux poweroff and reboot web application over password protected HTTP and tactile switch

### Built With

* [onoff](https://github.com/fivdi/onoff)

## Getting Started

### Prerequisites

* A Raspberry Pi

### Installation

```sh
git clone https://github.com/13/node-rpi-poweroff.git

npm install
npm rebuild
```

## Usage

```sh
node run.js -t 'show timestamp'
```

```sh
node run.js -t
```

## Troubleshooting

* Allow port 80 on linux

```sh
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```
 
## Roadmap

- [ ] ...

## Release History

* 1.0.0
    * Initial release

## Contact

* **13** - *Initial work* - [13](https://github.com/13)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thank you
