<?php

namespace Tests;

use Laravel\Lumen\Testing\TestCase as BaseTestCase;

class TestCase extends BaseTestCase
{
    public function createApplication()
    {
        return require __DIR__ . '/../bootstrap/app.php';
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');
    }
}

