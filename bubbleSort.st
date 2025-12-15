FUNCTION_BLOCK BubbleSortFB
VAR_INPUT
    Execute : BOOL;
    Reset : BOOL;
    ArrayIn : ARRAY[0..99] OF UDINT;
    Size : UDINT;
END_VAR

// ...existing implementation code...

END_FUNCTION_BLOCK
VAR_OUTPUT
    Status : INT;
    ErrorCode : INT;
END_VAR
VAR
    i : UDINT;
    j : UDINT;
    temp : UDINT;
    Sorting : BOOL := FALSE;
END_VAR

// BubbleSortFB implementation skeleton
IF Reset THEN
    Status := 0;
    ErrorCode := 0;
    Sorting := FALSE;
ELSIF Execute AND NOT Sorting THEN
    // Edge case checks
    IF Size = 0 THEN
        Status := -1;
        ErrorCode := 1; // Invalid Size
    ELSIF Size > 100 THEN
        Status := -1;
        ErrorCode := 1; // Invalid Size
    ELSE
        Sorting := TRUE;
        Status := 1;
        ErrorCode := 0;
            // Bubble sort algorithm
            FOR i := 0 TO Size - 2 DO
                FOR j := 0 TO Size - i - 2 DO
                    IF ArrayIn[j] > ArrayIn[j + 1] THEN
                        temp := ArrayIn[j];
                        ArrayIn[j] := ArrayIn[j + 1];
                        ArrayIn[j + 1] := temp;
                    END_IF
                END_FOR
            END_FOR
            Status := 2; // Done
            Sorting := FALSE;
    END_IF
END_IF
// ...existing code...
END_FUNCTION_BLOCK
