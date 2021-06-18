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