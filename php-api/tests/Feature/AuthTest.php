<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    public function test_register_creates_user_and_returns_201(): void
    {
        $email = 'user' . uniqid() . '@example.com';

        $this->post('/api/register', [
            'name' => 'Test User',
            'email' => $email,
            'password' => 'secret123',
        ]);

        $this->seeStatusCode(201);
        $this->seeJsonStructure(['message', 'user' => ['id', 'name', 'email']]);
        $this->seeInDatabase('users', ['email' => $email]);
    }

    public function test_login_returns_token_on_valid_credentials(): void
    {
        $user = User::create([
            'name' => 'Login User',
            'email' => 'login@example.com',
            'password' => Hash::make('secret123'),
        ]);

        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $this->seeStatusCode(200);
        $this->seeJsonStructure(['token']);
        $json = json_decode($this->response->getContent(), true);
        $this->assertNotEmpty($json['token']);
    }

    public function test_login_fails_on_bad_password(): void
    {
        $user = User::create([
            'name' => 'Bad Pass',
            'email' => 'badpass@example.com',
            'password' => Hash::make('secret123'),
        ]);

        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpass',
        ]);

        $this->seeStatusCode(401);
    }
}

