import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ItemDetails({ category }: { category: string }) {
  return (
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Item Details</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    .item-details {
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .item-header {
      background-color: #f4f4f4;
      padding: 20px;
      text-align: center;
    }
    .item-header h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    .item-body {
      padding: 20px;
    }
    .item-body img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
    .item-details ul {
      list-style: none;
      padding: 0;
      margin: 10px 0 0;
    }
    .item-details li {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
    .item-footer {
      background-color: #f9f9f9;
      padding: 10px 20px;
      text-align: center;
      font-size: 0.9rem;
      color: #555;
    }
    .button {
      display: inline-block;
      margin: 10px 0;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>

<div class="item-details">
  <div class="item-header">
    <h2>Item Title</h2>
  </div>
  <div class="item-body">
    <img src="item-image.jpg" alt="Item Image">
    <ul>
      <li><strong>Price:</strong> $99.99</li>
      <li><strong>Category:</strong> Electronics</li>
      <li><strong>Description:</strong> A brief description of the item goes here.</li>
    </ul>
    <a href="#" class="button">Buy Now</a>
  </div>
  <div class="item-footer">
    <p>For more information, contact us at info@example.com</p>
  </div>
</div>

</body>
</html>
  );
}
