<?php
// Frontend Configuration for cPanel Deployment
// This file provides configuration for the React frontend

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Configuration settings
$config = [
    'apiBaseUrl' => '', // Empty for same-domain API calls
    'uploadPath' => '/uploads/',
    'version' => '1.0.0',
    'features' => [
        'whatsapp' => true,
        'propertyUpload' => true,
        'sliderManagement' => true,
        'adminDashboard' => true
    ],
    'contact' => [
        'phone' => '+251 911 123 456',
        'email' => 'info@temerproperties.com',
        'address' => 'Bole Road, Addis Ababa, Ethiopia'
    ]
];

echo json_encode($config);
?>