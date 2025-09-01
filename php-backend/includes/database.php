<?php
require_once 'config.php';

class Database {
    private $client;
    private $database;
    
    public function __construct() {
        // For PHP deployment, we'll use JSON file storage instead of MongoDB
        // This makes deployment much simpler on cPanel
        $this->initializeStorage();
    }
    
    private function initializeStorage() {
        // Create data storage directories
        $dataDir = __DIR__ . '/../data/';
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        
        // Initialize default data files if they don't exist
        $this->initializeDataFile('properties.json', $this->getDefaultProperties());
        $this->initializeDataFile('slider.json', $this->getDefaultSlider());
        $this->initializeDataFile('settings.json', $this->getDefaultSettings());
    }
    
    private function initializeDataFile($filename, $defaultData) {
        $filepath = __DIR__ . '/../data/' . $filename;
        if (!file_exists($filepath)) {
            file_put_contents($filepath, json_encode($defaultData, JSON_PRETTY_PRINT));
        }
    }
    
    // Properties CRUD
    public function getProperties() {
        return $this->readJsonFile('properties.json');
    }
    
    public function createProperty($data) {
        $properties = $this->getProperties();
        $data['id'] = $this->generateId();
        $properties[] = $data;
        $this->writeJsonFile('properties.json', $properties);
        return $data;
    }
    
    public function updateProperty($id, $data) {
        $properties = $this->getProperties();
        foreach ($properties as &$property) {
            if ($property['id'] === $id) {
                $property = array_merge($property, $data);
                $this->writeJsonFile('properties.json', $properties);
                return $property;
            }
        }
        return null;
    }
    
    public function deleteProperty($id) {
        $properties = $this->getProperties();
        $properties = array_filter($properties, function($p) use ($id) {
            return $p['id'] !== $id;
        });
        $this->writeJsonFile('properties.json', array_values($properties));
        return true;
    }
    
    // Slider CRUD
    public function getSliderImages() {
        return $this->readJsonFile('slider.json');
    }
    
    public function createSliderImage($data) {
        $slider = $this->getSliderImages();
        $data['id'] = $this->generateId();
        $slider[] = $data;
        $this->writeJsonFile('slider.json', $slider);
        return $data;
    }
    
    public function deleteSliderImage($id) {
        $slider = $this->getSliderImages();
        $slider = array_filter($slider, function($s) use ($id) {
            return $s['id'] !== $id;
        });
        $this->writeJsonFile('slider.json', array_values($slider));
        return true;
    }
    
    // Settings
    public function getSettings($type) {
        $settings = $this->readJsonFile('settings.json');
        return isset($settings[$type]) ? $settings[$type] : null;
    }
    
    public function updateSettings($type, $data) {
        $settings = $this->readJsonFile('settings.json');
        $settings[$type] = array_merge($settings[$type] ?? [], $data);
        $this->writeJsonFile('settings.json', $settings);
        return $settings[$type];
    }
    
    // Helper methods
    private function readJsonFile($filename) {
        $filepath = __DIR__ . '/../data/' . $filename;
        if (!file_exists($filepath)) {
            return [];
        }
        $content = file_get_contents($filepath);
        return json_decode($content, true) ?: [];
    }
    
    private function writeJsonFile($filename, $data) {
        $filepath = __DIR__ . '/../data/' . $filename;
        return file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT));
    }
    
    private function generateId() {
        return uniqid() . rand(1000, 9999);
    }
    
    // Default data
    private function getDefaultProperties() {
        return [
            [
                'id' => '68a999252e55422e34fbc7ff',
                'title' => 'Modern Apartment in Bole',
                'description' => 'Luxury 3-bedroom apartment with stunning city views in the heart of Bole district.',
                'price' => 2500000,
                'location' => 'Bole, Addis Ababa',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 120,
                'type' => 'apartment',
                'status' => 'for-sale',
                'images' => ['/uploads/properties/modern-apartment-1.jpg'],
                'featured' => true
            ],
            [
                'id' => '68a999252e55422e34fbc800',
                'title' => 'Executive Villa in Kazanchis',
                'description' => 'Spacious 4-bedroom villa with private garden and parking in prestigious Kazanchis area.',
                'price' => 4500000,
                'location' => 'Kazanchis, Addis Ababa',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'area' => 200,
                'type' => 'villa',
                'status' => 'for-sale',
                'images' => ['/uploads/properties/executive-villa-1.jpg'],
                'featured' => true
            ],
            [
                'id' => '68a999252e55422e34fbc801',
                'title' => 'Commercial Space in Piassa',
                'description' => 'Prime commercial location perfect for retail or office space in busy Piassa district.',
                'price' => 3200000,
                'location' => 'Piassa, Addis Ababa',
                'bedrooms' => 0,
                'bathrooms' => 2,
                'area' => 80,
                'type' => 'commercial',
                'status' => 'for-rent',
                'images' => ['/uploads/properties/commercial-space-1.jpg'],
                'featured' => false
            ]
        ];
    }
    
    private function getDefaultSlider() {
        return [
            [
                'id' => '68a84cd20af0afa642d45f08',
                'imageUrl' => '/uploads/slider/hero-1.jpg',
                'title' => 'Find Your Dream Home',
                'subtitle' => 'Premium Properties in Addis Ababa',
                'active' => true
            ],
            [
                'id' => '68a84cd20af0afa642d45f09',
                'imageUrl' => '/uploads/slider/hero-2.jpg',
                'title' => 'Luxury Living Awaits',
                'subtitle' => 'Modern Apartments & Villas',
                'active' => true
            ],
            [
                'id' => '68a84cd20af0afa642d45f10',
                'imageUrl' => '/uploads/slider/hero-3.jpg',
                'title' => 'Investment Opportunities',
                'subtitle' => 'Commercial & Residential Properties',
                'active' => true
            ]
        ];
    }
    
    private function getDefaultSettings() {
        return [
            'whatsapp' => [
                'id' => '68a961f714b44224e9cbaca9',
                'phoneNumber' => '+251975666699',
                'message' => 'Hello! I\'m interested in your properties.',
                'enabled' => true
            ],
            'contact' => [
                'id' => '68a976978d45237b33fa95d9',
                'phone' => '+251975666699',
                'email' => 'info@temerproperties.com',
                'address' => 'Bole Road, Addis Ababa, Ethiopia',
                'facebook' => 'https://facebook.com/temerproperties',
                'instagram' => 'https://instagram.com/temerproperties',
                'linkedin' => 'https://linkedin.com/company/temerproperties'
            ]
        ];
    }
}
?>