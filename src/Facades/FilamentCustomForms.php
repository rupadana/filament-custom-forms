<?php

namespace Rupadana\FilamentCustomForms\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Rupadana\FilamentCustomForms\FilamentCustomForms
 */
class FilamentCustomForms extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \Rupadana\FilamentCustomForms\FilamentCustomForms::class;
    }
}
