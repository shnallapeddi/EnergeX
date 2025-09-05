<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Predis\Client as Predis;

class PostController extends Controller
{
    protected $redis;

    public function __construct()
    {
        $this->redis = new Predis([
            'host' => env('REDIS_HOST','127.0.0.1'),
            'port' => (int) env('REDIS_PORT', 6379),
        ]);
    }

    public function index()
    {
        $key = 'posts:all';
        if ($cached = $this->redis->get($key)) {
            return response()->json(json_decode($cached, true));
        }

        $posts = Post::orderBy('id','desc')->get();
        $this->redis->set($key, $posts->toJson());
        return response()->json($posts);
    }

    public function show($id)
    {
        $key = "posts:$id";
        if ($cached = $this->redis->get($key)) {
            return response()->json(json_decode($cached, true));
        }

        $post = Post::find($id);
        if (!$post) return response()->json(['message' => 'Not found'], 404);

        $this->redis->set($key, $post->toJson());
        return response()->json($post);
    }

    public function store(Request $req)
    {
        $this->validate($req, [
            'title' => 'required|string|max:200',
            'content' => 'required|string',
        ]);

        $userId = auth()->id();
        $post = Post::create([
            'title' => $req->title,
            'content' => $req->content,
            'user_id' => $userId,
        ]);

        // Invalidate list cache
        $this->redis->del(['posts:all']);
        return response()->json($post, 201);
    }
}
