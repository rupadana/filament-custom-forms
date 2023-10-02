<?php

namespace Rupadana\FilamentCustomForms\Components;

use Filament\Forms\Components\Concerns\HasLabel;
use Filament\Forms\Components\Grid;

class InputGroup extends Grid
{
    use HasLabel;

    protected string $view = 'filament-custom-forms::components.grid';

    public static function make(array | int | string | null $columns = 2): static
    {
        $static = parent::make($columns);

        $static->extraAttributes(['class' => 'filament-input-group gap-y-2 grid']);

        $static->columnSpan(1);

        return $static;
    }
}
