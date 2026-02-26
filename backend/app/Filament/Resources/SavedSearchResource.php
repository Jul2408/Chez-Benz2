<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SavedSearchResource\Pages;
use App\Models\SavedSearch;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SavedSearchResource extends Resource
{
    protected static ?string $model = SavedSearch::class;

    protected static ?string $navigationIcon = 'heroicon-o-magnifying-glass-plus';
    
    protected static ?string $navigationGroup = 'Administration';

    protected static ?string $label = 'Recherche Sauvegardée';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'email')
                    ->required()
                    ->searchable(),
                Forms\Components\TextInput::make('name')
                    ->required(),
                Forms\Components\KeyValue::make('filters')
                    ->required(),
                Forms\Components\Toggle::make('notification_enabled')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Utilisateur')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\IconColumn::make('notification_enabled')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageSavedSearches::route('/'),
        ];
    }
}
