import {dispatch } from  './functions'
import {AddRequestBody, SubtractRequestBody, ListRequestBody, AtRequestBody, FirstRequestBody, 
    LastRequestBody,SortRequestBody, ReverseRequestBody,ConcatRequestBody,SomeRequestBody,NowRequestBody, YearRequestBody, TodayRequestBody,MonthRequestBody,
    DayRequestBody, DateAddRequestBody, DateSubtractRequestBody,DateRangeRequestBody,DateBetweenRequestBody,TimestampRequestBody, FunctionRequestBody} from './functions'
describe('dispatch function', () => {
    it('should return the sum of two numbers', () => {
      const reqBody: AddRequestBody = { function: 'add', num1: 1, num2: 2 }
      const result = dispatch(reqBody)
      expect(result.result).toBe(3)
    })
    it('should return the difference of two numbers', () => {
      const reqBody: SubtractRequestBody = { function: 'subtract', num1: 5, num2: 2 }
      const result = dispatch(reqBody)
      expect(result.result).toBe(3)
    })
    it('should return the list of items', () => {
      const reqBody: ListRequestBody<number> = { function: 'list', items: [1, 2, 3] }
      const result = dispatch(reqBody)
      expect(result.result).toEqual([1, 2, 3])
    })
    it('should return the item at the given index', () => {
      const reqBody: AtRequestBody<string> = { function: 'at', items: ["hello", "kk", "mix"], index: 1 }
      const result = dispatch(reqBody)
      expect(result.result).toBe("kk")

    })
    it ('should return the first item in the list', () => {
        const reqBody: FirstRequestBody<string> = { function: 'first', items: ["hello", "kk", "mix"], index: 0 }
        const result = dispatch(reqBody)
        expect(result.result).toBe("hello")
        })
    it ('should return the last item in the list', () => {
        const reqBody: LastRequestBody<string> = { function: 'last', items: ["hello", "kk", "mix"] }
        const result = dispatch(reqBody)
        expect(result.result).toBe("mix")
        })
    it ('should return the sorted list', () => {
        const reqBody: SortRequestBody<number> = { function: 'sort', items: [99,11,7,5,4,3,2,1] }
        const result = dispatch(reqBody)
        expect(result.result).toEqual([1,2,3,4,5,7,11,99])
        })
    it ('should return the reversed list', () => {
        const reqBody: ReverseRequestBody<number> = { function: 'reverse', items: [1,4,5,7,99,3,2,11] }
        const result = dispatch(reqBody)
        expect(result.result).toEqual([11,2,3,99,7,5,4,1])
        })
    it ('should concat the list of items', () => {
        const reqBody: ConcatRequestBody<number> = { function: 'concat', lists: [[1,2,3],[4,5,6],[7,8,9]] }
        const result = dispatch(reqBody)
        expect(result.result).toEqual([1,2,3,4,5,6,7,8,9])
        })
    it('should return false if no items match the predicate', () => {
        const reqBody: SomeRequestBody<number> = { function: 'some', items: [1, 2, 3, 4, 5], predicate: (item) => item > 5 };
        const result = dispatch(reqBody);
        expect(result.result).toBe(false)
        });
    
        
    it('should return undefined for invalid request', () => {
      const reqBody: FunctionRequestBody = { function: 'invalid' }
      const result = dispatch(reqBody)
      expect(result.result).toBeUndefined()
    })
    it('should return the current date and time', () => {
        const reqBody: NowRequestBody = { function: 'now' }
        const result = dispatch(reqBody)
        console.log(result.result)
        expect(typeof result.result).toBe('string')
    })
    it('should return the current date ', () => {
        const reqBody: TodayRequestBody = { function: 'today' }
        const result = dispatch(reqBody)
        console.log(result.result)
        expect(typeof result.result).toBe('string')
    })
    it ('should return the year', () => {
        let now = new Date()
        const reqBody: YearRequestBody = { function: 'year',date: now }
        const result = dispatch(reqBody)
        console.log(result.result)
        expect(result.result).toBe(now.getFullYear())
        })
    it ('should return the month', () => {
        let now = new Date()
        const reqBody: MonthRequestBody = { function: 'month',date: now }
        const result = dispatch(reqBody)
        console.log(result.result)
        expect(result.result).toBe(now.getMonth()+1)
        })
    it ('should return the day', () => {
        let now = new Date()
        const reqBody: DayRequestBody = { function: 'day',date: now }
        const result = dispatch(reqBody)
        console.log(result.result)
        expect(result.result).toBe(now.getDate())
        })
      it('should return the added date', () => {
        const now = new Date(); // Get the current date
        const reqBody: DateAddRequestBody = { function: 'dateAdd', date: now, days: 2 };
        
        const result = dispatch(reqBody);  // Make sure dispatch returns the result
        console.log(result.result);
        
        // Check that the date is exactly 2 days after the current date
        const expectedDate = new Date(now);
        expectedDate.setDate(now.getDate() + 2);
        
        // Ensure the result is the same as the expected date by comparing time
        expect(result.result.getTime()).toBe(expectedDate.getTime());
      });
      
      it('should return the subtracted date', () => {
        const now = new Date(); // Get the current date
        const reqBody: DateSubtractRequestBody = { function: 'dateSubtract', date: now, days: 5 };
        
        const result = dispatch(reqBody);  // Make sure dispatch returns the result
        console.log(result.result);
        
        // Check that the date is exactly 5 days before the current date
        const expectedDate = new Date(now);
        expectedDate.setDate(now.getDate() - 5);
        
        // Ensure the result is the same as the expected date by comparing time
        expect(result.result.getTime()).toBe(expectedDate.getTime());
      });
        
      it('should return the difference between two dates in days', () => {
        const reqBody: DateBetweenRequestBody = { function: 'dateBetween', startDate: new Date('2022-09-07'), endDate: new Date('2023-08-30'), unit: 'days' };
        const result = dispatch(reqBody);
        expect(result.result).toBe(357);
      });
    
      // Add the test case for the dateRange function
      it('should return the date range between two dates', () => {
        const reqBody: DateRangeRequestBody = { function: 'dateRange', startDate: new Date('2022-09-07'), endDate: new Date('2023-09-07') };
        const result = dispatch(reqBody);
        expect(result.result).toEqual({ startDate: new Date('2022-09-07'), endDate: new Date('2023-09-07') });
      });
      it('should return the Unix timestamp of the given date', () => {
        const reqBody: TimestampRequestBody = { function: 'timestamp', date: new Date('2023-08-30T17:55:00') };
        const result = dispatch(reqBody);
        expect(result.result).toBe(1693443300000);
      });
    
      // Add the test case for the formatDate function
    
      

});