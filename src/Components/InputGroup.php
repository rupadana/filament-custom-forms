<?php

namespace Rupadana\FilamentCustomForms\Components;

use Closure;
use Filament\Forms\Components\Concerns\HasLabel;
use Filament\Forms\Components\Field;
use Filament\Forms\Components\Grid;

class InputGroup extends Grid
{
    use HasLabel;

    protected bool $isHideChildLabel = true;

    protected string $view = 'filament-custom-forms::components.grid';

    public static function make(array | int | string | null $columns = 2): static
    {
        $static = parent::make($columns);

        $static->extraAttributes(['class' => 'filament-input-group gap-y-2 grid']);

        return $static;
    }

    public function schema(array | Closure $components): static
    {
        $this->childComponents($components);

        return $this;
    }

    public function showChildLabel(bool $condition = true)
    {

        $this->isHideChildLabel = ! $condition;

        return $this;
    }

    /**
     * @return array<Component>
     */
    public function getChildComponents(): array
    {

        $components = $this->childComponents;

        if ($this->isHideChildLabel) {
            $components = collect($components)->map(function (Field $component) {
                if (method_exists($component, 'placeholder')) {
                    $component = $component->placeholder($component->getLabel());
                }

                return $component->hiddenLabel();
            })->toArray();
        }

        return $this->evaluate($components);
    }

    protected function setUp(): void
    {
    }
}
