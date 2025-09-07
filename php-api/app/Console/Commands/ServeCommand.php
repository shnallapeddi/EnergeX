<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class ServeCommand extends Command
{
    protected $signature = 'serve {--host=127.0.0.1} {--port=8000}';
    protected $description = 'Serve the Lumen application';

    public function handle()
    {
        $host = $this->option('host');
        $port = $this->option('port');

        $this->info("Lumen development server started: http://{$host}:{$port}");

        $process = new Process(['php', '-S', "{$host}:{$port}", 'public/index.php']);
        $process->setTty(Process::isTtySupported());
        $process->run();
    }
}
