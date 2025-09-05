<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PostsTest extends TestCase
{
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::create([
            'name' => 'Poster',
            'email' => 'poster@example.com',
            'password' => Hash::make('secret123'),
        ]);

        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $json = json_decode($this->response->getContent(), true);
        $this->token = $json['token'];
        $this->assertNotEmpty($this->token);
    }

    public function test_list_posts_requires_auth(): void
    {
        $this->get('/api/posts');
        $this->seeStatusCode(401);
    }

    public function test_create_and_fetch_posts(): void
    {
        $this->post('/api/posts', [
            'title' => 'Hello From Test',
            'content' => 'Content body',
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $this->seeStatusCode(201);
        $this->seeInDatabase('posts', ['title' => 'Hello From Test']);

        $this->get('/api/posts', [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $this->seeStatusCode(200);
        $this->seeJsonContains(['title' => 'Hello From Test']);
    }

    public function test_get_single_post(): void
    {
        $this->post('/api/posts', [
            'title' => 'One',
            'content' => 'Only',
        ], [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $created = json_decode($this->response->getContent(), true);
        $id = $created['id'] ?? null;
        $this->assertNotNull($id);

        $this->get('/api/posts/' . $id, [
            'Authorization' => 'Bearer ' . $this->token,
        ]);

        $this->seeStatusCode(200);
        $this->seeJsonContains(['id' => $id]);
    }
}

