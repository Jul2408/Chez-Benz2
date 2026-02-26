<?php

namespace App\Filament\Resources\BoostResource\Pages;

use App\Filament\Resources\BoostResource;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;

class ManageBoosts extends ManageRecords
{
    protected static string $resource = BoostResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
