# exec-php

Execute PHP function within NodeJS application

## Installation

```bash
npm install exec-php
```

## Usage

```js
let execPhp = require('exec-php');

execPhp('path/to/file.php', '/usr/bin/php', (err, php, out) => {
    // the `php` argument is now contains all php defined functions
    php.my_func(arg1, arg2, (err, res, out, print) => {
        // `res` argument is now hold the returned value of `my_func` php function
        // `print` hold anything that get printed during calling the `my_func` function
    })
})
```

## Arguments

1. `phpfile::string` Path to user php file.
1. `phpbin::string` Path to engine php binary file.
1. `callback::function` A function to call after populating the php functions.

The `callback` function will be called with below arguments:

1. `error::mixed` The error message.
1. `php::object` The php object that hold all php defined functions.
1. `printed::string` All printed string while populating php functions.

## php Arguments

All user defined function on php engine will be appended to `php` argument of
the caller. The function will be **lower case**. You can now call the function
normally with additional last argument is the callback function to get response
of the php functions call with below arguments:

1. `error::mixed` Error message
1. `result::mixed` Returned content of user php function
1. `output::string` Printed string on requiring the php file.
1. `printed::string` Printed string on calling user php function.

## Example

```php
// file.php
<?php

echo "One";
function my_function($arg1, $arg2){
    echo "Two";
    return $arg1 + $arg2;
}
```

```js
// app.js
let execPhp = require('exec-php');

execPhp('file.php', (err, php, out) => {
    // outprint is now `One'.

    php.my_function(1, 2, (err, result, output, printed) => {
        // result is now `3'
        // output is now `One'.
        // printed is now `Two'.
    })
})
```

## Note

All uppercase function name on PHP will be converted to lowercase on `exec-php`.

```php
// file.php
<?php

function MyFunction($a, $b){
    return $a + $b;
}
```

```js
// app.js
let execPhp = require('exec-php')

execPhp('file.php', (err, php, out) => {
    php.myfunction(1, 2, function(error, result){
        // result is now 3
    })
})
```

## ChangeLog

1. 0.0.3
    1. Handle PHP throw error exception
1. 0.0.4
    1. Upgrade tmp module to suppress opsolete functions ( [GuilhermeReda](https://github.com/GuilhermeReda) )
    1. Add `noop` function to support the new node callback standard
1. 0.0.5
    1. Close temp file pointer on removing the file ( [MHDMAM](https://github.com/MHDMAM) )
1. 0.0.6
    1. Remove deprecated `module.parent` ( [Jakub Zasański](https://github.com/jakubzasanski) )
    1. Upgrade deprecated dependencies
