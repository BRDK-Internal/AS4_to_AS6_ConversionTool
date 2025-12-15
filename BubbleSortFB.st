// Implementation for BubbleSortFB
IF Reset THEN
    Status := 0;
    ErrorCode := 0;
    Sorting := FALSE;
ELSIF Execute AND NOT Sorting THEN
    IF Size = 0 THEN
        Status := -1;
        ErrorCode := 1;
    ELSIF Size > 100 THEN
        Status := -1;
        ErrorCode := 1;
    ELSE
        Sorting := TRUE;
        Status := 1;
        ErrorCode := 0;
        // Insertion sort algorithm
        FOR i := 1 TO Size - 1 DO
            temp := ArrayIn[i];
            j := i;
            WHILE (j > 0) AND (ArrayIn[j - 1] > temp) DO
                ArrayIn[j] := ArrayIn[j - 1];
                j := j - 1;
            END_WHILE
            ArrayIn[j] := temp;
        END_FOR
        Status := 2;
        Sorting := FALSE;
    END_IF
END_IF
