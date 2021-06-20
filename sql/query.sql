-- View
USE WebCSDL
SELECT * FROM [Customer]
SELECT * FROM [Product]
SELECT * FROM [Order]
SELECT * FROM [OrderList]
SELECT * FROM [Cart]

-- Test
-- Khách hàng thân thiết
SELECT Customer.Username, Customer.Name, Statistic.TotalPaid, Statistic.OrdersNumber FROM [Customer]
INNER JOIN 
(
	SELECT TOP 5 SUM(Total) AS TotalPaid, COUNT(OrderID) AS OrdersNumber, Username
	FROM [Order]
	GROUP BY Username
	ORDER BY TotalPaid DESC
) AS Statistic
ON Statistic.Username = Customer.Username

-- Đơn hàng chưa thanh toán
SELECT Cart.Username, SUM(Product.Price*Cart.Quantity)*1.05 AS Total FROM [Cart]
INNER JOIN [Product] ON Cart.ProductID = Product.ProductID
GROUP BY Cart.Username

-- Thông tin đơn hàng
SELECT [Order].*, Customer.Name, Customer.Address, Customer.Phone FROM [Order]
INNER JOIN [Customer] ON Customer.Username = [Order].Username
WHERE OrderID = '1623982297858'


-- DELETE
DELETE FROM [OrderList]
DELETE FROM [Cart]
DELETE FROM [Order]
DELETE FROM [Product]
