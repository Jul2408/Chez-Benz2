<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NotificationResource\Pages;
use Illuminate\Notifications\DatabaseNotification;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class NotificationResource extends Resource
{
    protected static ?string $model = DatabaseNotification::class;

    protected static ?string $navigationIcon = 'heroicon-o-bell';

    protected static ?string $navigationGroup = 'Administration';

    protected static ?string $label = 'Notification Log';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('type')
                    ->required(),
                Forms\Components\Select::make('notifiable_id')
                    ->label('Utilisateur')
                    ->relationship('notifiable', 'email')
                    ->required(),
                Forms\Components\KeyValue::make('data')
                    ->required(),
                Forms\Components\DateTimePicker::make('read_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('notifiable.email')
                    ->label('Destinataire')
                    ->searchable(),
                Tables\Columns\TextColumn::make('data.title')
                    ->label('Titre')
                    ->searchable(),
                Tables\Columns\IconColumn::make('read_at')
                    ->label('Lu')
                    ->boolean()
                    ->getStateUsing(fn ($record) => !is_null($record->read_at)),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ManageNotifications::route('/'),
        ];
    }
}
