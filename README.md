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

### Input Group

```php
InputGroup::make(3)
    ->label('Input Group')
    ->schema([
        TextInput::make('first'),
        Select::make('second'),
        ColorPicker::make('third'),
    ])
```


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


### Input Slider

Simple Input Slider

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('column_name')
])
->label('Column Name')
```


Multiple Input

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('column_min')
    InputSlider::make('column_max')
])
->label('Column Name')
```

Connect

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('column_min')
    InputSlider::make('column_max')
])
->connect([
    false,
    true,
    false
])
->label('Column Name')
```

Maximum & Minimum

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('column_min')
    InputSlider::make('column_max')
])
->connect([
    false,
    true,
    false
])
->max(100)
->min(0)
->label('Column Name')
```


Complete

```php
InputSliderGroup::make()
    ->sliders([
        InputSlider::make('column_min'),
        InputSlider::make('column_max')->default(50),
    ])
    ->connect([
        true,
        false,
        true
    ]) // array length must be sliders length + 1
    ->range([
        "min" => 30,
        "max" => 100
    ])
    ->step(10)
    ->behaviour([
        InputSliderBehaviour::DRAG,
        InputSliderBehaviour::TAP
    ])
    ->enableTooltips()
    ->label("Input Slider")
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
