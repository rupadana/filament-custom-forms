@php

@endphp

<div {{ $attributes ->merge([
    'id' => $getId(),
    ], escape: false)
    ->merge($getExtraAttributes(), escape: false)
    }}
    >
    @if ($isLabelHidden() == false)
        <x-filament-forms::field-wrapper.label>
            {{$getLabel()}}
        </x-filament-forms::field-wrapper.label>
    @endif

    {{ $getChildComponentContainer() }}
</div>