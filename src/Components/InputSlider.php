<?php

namespace Rupadana\FilamentCustomForms\Components;

use Closure;
use Filament\Forms\Components\Component;
use Filament\Forms\Components\Concerns\HasLabel;
use Filament\Forms\Components\Field;

class InputSlider extends Field {
    protected string $view = 'filament-custom-forms::components.hidden-input';

    public static function make(string $name): static
    {
        $static = parent::make($name);

        $static->default(0);

        return $static;
    }
    
}