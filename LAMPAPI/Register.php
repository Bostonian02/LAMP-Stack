
<?php

	$inData = getRequestInfo();
	
	$id = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Set up SQL statement
		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES( ?, ?, ?, ?)");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
		//$result = $stmt->get_result();
		
		// Gets created row
		//if( $row = $result->fetch_assoc()  )
		//{
		//	returnWithInfo( $row['ID'] );
		//}
		//else
		//{
		//	// Was not able to create row
		//	returnWithError("No Records Found");
		//}
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
