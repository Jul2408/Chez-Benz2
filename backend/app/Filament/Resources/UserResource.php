<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'Administration';

    protected static ?string $label = 'Membre';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Identifiants')
                    ->schema([
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true),
                        Forms\Components\Select::make('role')
                            ->options([
                                'USER' => 'Utilisateur',
                                'MODERATOR' => 'Modérateur',
                                'ADMIN' => 'Administrateur',
                            ])
                            ->required()
                            ->default('USER'),
                        Forms\Components\TextInput::make('password')
                            ->password()
                            ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $context): bool => $context === 'create'),
                    ])->columns(3),

                Forms\Components\Section::make('Détails du Profil')
                    ->description('Ces informations sont stockées dans la table Profile')
                    ->schema([
                        Forms\Components\TextInput::make('profile.full_name')
                            ->label('Nom complet'),
                        Forms\Components\TextInput::make('profile.phone')
                            ->label('Téléphone'),
                        Forms\Components\TextInput::make('profile.city')
                            ->label('Ville'),
                        Forms\Components\TextInput::make('profile.credits')
                            ->label('Crédits')
                            ->numeric()
                            ->default(0),
                        Forms\Components\Toggle::make('profile.is_verified')
                            ->label('Vérifié'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('profile.full_name')
                    ->label('Nom')
                    ->searchable(),
                Tables\Columns\BadgeColumn::make('role')
                    ->colors([
                        'primary' => 'USER',
                        'warning' => 'MODERATOR',
                        'danger' => 'ADMIN',
                    ]),
                Tables\Columns\TextColumn::make('profile.credits')
                    ->label('Crédits')
                    ->sortable(),
                Tables\Columns\IconColumn::make('profile.is_verified')
                    ->label('Vérifié')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        'USER' => 'Utilisateur',
                        'MODERATOR' => 'Modérateur',
                        'ADMIN' => 'Administrateur',
                    ]),
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
