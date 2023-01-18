
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$date = date('Y-m-d H:i:s');

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Set up SQL statement
		$stmt = $conn->prepare(
			"INSERT INTO Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password)
			 VALUES (:date_created, :date_last_logged_in, :first_name, :last_name, :login, :password)");
		$stmt->bindParam(":date_created", $date);
		$stmt->bindParam(":date_last_logged_in", $date);
		$stmt->bindParam(":first_name", $inData["firstName"]);
		$stmt->bindParam(":last_name", $inData["lastName"]);
		$stmt->bindParam(":login", $inData["login"]);
		$stmt->bindParam(":password", $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();
		
		// Gets created row
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['ID'] );
		}
		else
		{
			// Was not able to create row
			returnWithError("No Records Found");
		}
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id )
	{
		// If return with an id > 0, user has been created
		$retValue = '{"id":' . $id . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
