<?php

namespace Tests;

class ExampleTest extends TestCase
{
    public function test_app_boots(): void
    {
        $this->get('/api/login'); // any existing route; will be 405/401 but not 404
        $this->assertTrue(in_array($this->response->getStatusCode(), [200, 401, 405], true));
    }
}

