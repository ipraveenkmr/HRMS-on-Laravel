<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AssignedJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'task',
        'username',
        'employee_id',
        'department_id',
        'manager',
        'task_time',
        'comment',
        'submission_date',
        'status',
        'document',
        'description'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}