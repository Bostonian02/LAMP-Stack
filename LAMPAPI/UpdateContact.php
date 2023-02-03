<?php
    // Updates the fields with no empty string input: ""
    // cannot update ID and userID

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        if ($inData["name"] != "")
        {
            $stmt = $conn->prepare("UPDATE Contacts SET Name = ? WHERE ID = ? ");
            $stmt->bind_param("si", $inData["name"], $inData["id"]);
            $stmt->execute();
        }

        if ($inData["phone"] != "")
        {
            $stmt = $conn->prepare("UPDATE Contacts SET Phone = ? WHERE ID = ? ");
            $stmt->bind_param("si", $inData["phone"], $inData["id"]);
            $stmt->execute();
        }

        if ($inData["email"] != "")
        {
            $stmt = $conn->prepare("UPDATE Contacts SET Email = ? WHERE ID = ? ");
            $stmt->bind_param("si", $inData["email"], $inData["id"]);
            $stmt->execute();
        }
        returnWithError("test");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>