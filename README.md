# Found missing form in filamentphp here

[![Latest Version on Packagist](https://img.shields.io/packagist/v/rupadana/filament-custom-forms.svg?style=flat-square)](https://packagist.org/packages/rupadana/filament-custom-forms)
[![Total Downloads](https://img.shields.io/packagist/dt/rupadana/filament-custom-forms.svg?style=flat-square)](https://packagist.org/packages/rupadana/filament-custom-forms)



This is where your description should go. Limit it to a paragraph or two. Consider adding a small example.

## Installation

You can install the package via composer:

```bash
composer require rupadana/filament-custom-forms
```

## Usage

```php
InputGroup::make(3)
    ->label('Input Group')
    ->schema([
        TextInput::make('first'),
        Select::make('second'),
        ColorPicker::make('third'),
    ])


Show child Label

```php
InputGroup::make(3)
    ->showChildLabel()
    ->schema([
        TextInput::make('first'),
        Select::make('second'),
        ColorPicker::make('third'),
    ])
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Credits

- [Rupadana](https://github.com/rupadana)
- [All Contributors](../../contributors)
  
## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
