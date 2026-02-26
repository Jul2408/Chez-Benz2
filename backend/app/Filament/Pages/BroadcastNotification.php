<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Section;
use Filament\Actions\Action;
use App\Models\User;
use App\Notifications\BroadcastNotification as BroadcastNotif;
use Illuminate\Support\Facades\Notification;
use Filament\Notifications\Notification as FilamentNotif;

class BroadcastNotification extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationGroup = 'Administration';
    protected static ?string $title = 'Envoyer un Flash';
    protected static ?string $navigationLabel = 'Notification Flash';

    protected static string $view = 'filament.pages.broadcast-notification';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Message de Diffusion')
                    ->description('Ce message sera envoyé à TOUS les membres de la plateforme.')
                    ->schema([
                        TextInput::make('title')
                            ->label('Titre')
                            ->required()
                            ->placeholder('Ex: Maintenance prévue'),
                        Textarea::make('message')
                            ->label('Message')
                            ->required()
                            ->rows(5)
                            ->placeholder('Votre message ici...'),
                        TextInput::make('action_url')
                            ->label('URL d\'action (Optionnel)')
                            ->placeholder('Ex: /annonces'),
                    ])
            ])
            ->statePath('data');
    }

    public function send(): void
    {
        $data = $this->form->getState();
        
        $users = User::all();
        
        foreach ($users as $user) {
            $user->notify(new BroadcastNotif(
                $data['title'],
                $data['message'],
                $data['action_url'] ?? null
            ));
        }
        
        FilamentNotif::make()
            ->title('Diffusion terminée')
            ->body('Le message a été envoyé à ' . $users->count() . ' membres.')
            ->success()
            ->send();
            
        $this->form->fill();
    }
}
