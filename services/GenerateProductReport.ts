import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

const generateProductReport = async (product) => {
  const totalStock = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #FF9F43;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .report-title {
            color: #FF9F43;
            margin: 10px 0;
          }
          .info-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .gradient-box {
            background: linear-gradient(135deg, #FF9F43, #FF6B6B);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #687076;
            font-size: 12px;
          }
        </style>
      </head>
      <body style="font-family: 'Helvetica'; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div class="header">
          <h1 class="report-title">Product Inventory Report</h1>
          <p style="color: #687076;">Generated on ${formattedDate}</p>
        </div>

        <div class="info-box">
          <table>
            <tr>
              <th colspan="2">Product Information</th>
            </tr>
            <tr>
              <td><strong>Name</strong></td>
              <td>${product.name}</td>
            </tr>
            <tr>
              <td><strong>Barcode</strong></td>
              <td>#${product.barcode}</td>
            </tr>
            <tr>
              <td><strong>Type</strong></td>
              <td>${product.type}</td>
            </tr>
            <tr>
              <td><strong>Price</strong></td>
              <td>$${product.price}</td>
            </tr>
            <tr>
              <td><strong>Supplier</strong></td>
              <td>${product.supplier}</td>
            </tr>
          </table>
        </div>

        <div class="gradient-box">
          <h2 style="margin: 0;">Total Stock: ${totalStock} units</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>City</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${product.stocks.map(stock => `
              <tr>
                <td>${stock.name}</td>
                <td>${stock.localisation.city}</td>
                <td>${stock.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Last edited by Warehouseman #${product.editedBy[0].warehousemanId} on ${product.editedBy[0].at}</p>
          <p>This is an automatically generated report. Please verify all information.</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });

    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Product Report',
        UTI: 'com.adobe.pdf'
      });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    Alert.alert('Error', 'Failed to generate product report');
  }
};

export default generateProductReport;