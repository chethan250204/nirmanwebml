import requests
import json

test_cases = [
    
    {
        "name": "Competitive Commercial Bid - Strong Winner",
        "features": {
            "bid_total": 85000,
            "materials_cost": 34000,
            "labor_cost": 30000,
            "equipment_cost": 12000,
            "overhead_cost": 9000,
            "timeline_days": 60,
            "profit_margin": 15,
            "roi": 18,
            "contingency": 10,
            "project_budget": 100000,
            "category": "commercial"
        },
        "expected": "win"
    },
    {
        "name": "Aggressive Residential Pricing",
        "features": {
            "bid_total": 75000,
            "materials_cost": 30000,
            "labor_cost": 28000,
            "equipment_cost": 10000,
            "overhead_cost": 7000,
            "timeline_days": 45,
            "profit_margin": 12,
            "roi": 16,
            "contingency": 8,
            "project_budget": 95000,
            "category": "residential"
        },
        "expected": "win"
    },
    {
        "name": "Efficient Infrastructure Project",
        "features": {
            "bid_total": 200000,
            "materials_cost": 80000,
            "labor_cost": 70000,
            "equipment_cost": 30000,
            "overhead_cost": 20000,
            "timeline_days": 120,
            "profit_margin": 18,
            "roi": 22,
            "contingency": 12,
            "project_budget": 250000,
            "category": "infrastructure"
        },
        "expected": "win"
    },
    {
        "name": "Quick Turnaround Commercial",
        "features": {
            "bid_total": 45000,
            "materials_cost": 18000,
            "labor_cost": 16000,
            "equipment_cost": 6000,
            "overhead_cost": 5000,
            "timeline_days": 25,
            "profit_margin": 14,
            "roi": 20,
            "contingency": 6,
            "project_budget": 55000,
            "category": "commercial"
        },
        "expected": "win"
    },
    {
        "name": "Optimized Small Residential",
        "features": {
            "bid_total": 35000,
            "materials_cost": 14000,
            "labor_cost": 12000,
            "equipment_cost": 5000,
            "overhead_cost": 4000,
            "timeline_days": 20,
            "profit_margin": 13,
            "roi": 17,
            "contingency": 5,
            "project_budget": 42000,
            "category": "residential"
        },
        "expected": "win"
    },
    {
        "name": "Large Infrastructure Winner",
        "features": {
            "bid_total": 500000,
            "materials_cost": 200000,
            "labor_cost": 180000,
            "equipment_cost": 70000,
            "overhead_cost": 50000,
            "timeline_days": 180,
            "profit_margin": 16,
            "roi": 19,
            "contingency": 15,
            "project_budget": 600000,
            "category": "infrastructure"
        },
        "expected": "win"
    },
    {
        "name": "Medium Commercial Sweet Spot",
        "features": {
            "bid_total": 125000,
            "materials_cost": 50000,
            "labor_cost": 45000,
            "equipment_cost": 18000,
            "overhead_cost": 12000,
            "timeline_days": 75,
            "profit_margin": 17,
            "roi": 21,
            "contingency": 11,
            "project_budget": 145000,
            "category": "commercial"
        },
        "expected": "win"
    },
    {
        "name": "High-Value Residential",
        "features": {
            "bid_total": 180000,
            "materials_cost": 72000,
            "labor_cost": 65000,
            "equipment_cost": 25000,
            "overhead_cost": 18000,
            "timeline_days": 100,
            "profit_margin": 19,
            "roi": 24,
            "contingency": 13,
            "project_budget": 210000,
            "category": "residential"
        },
        "expected": "win"
    },
    {
        "name": "Cost-Effective Infrastructure",
        "features": {
            "bid_total": 300000,
            "materials_cost": 120000,
            "labor_cost": 110000,
            "equipment_cost": 40000,
            "overhead_cost": 30000,
            "timeline_days": 150,
            "profit_margin": 15,
            "roi": 18,
            "contingency": 14,
            "project_budget": 350000,
            "category": "infrastructure"
        },
        "expected": "win"
    },
    {
        "name": "Premium Commercial Bid",
        "features": {
            "bid_total": 220000,
            "materials_cost": 88000,
            "labor_cost": 80000,
            "equipment_cost": 30000,
            "overhead_cost": 22000,
            "timeline_days": 110,
            "profit_margin": 20,
            "roi": 25,
            "contingency": 16,
            "project_budget": 260000,
            "category": "commercial"
        },
        "expected": "win"
    },
    {
        "name": "Balanced Residential Project",
        "features": {
            "bid_total": 95000,
            "materials_cost": 38000,
            "labor_cost": 34000,
            "equipment_cost": 13000,
            "overhead_cost": 10000,
            "timeline_days": 55,
            "profit_margin": 16,
            "roi": 19,
            "contingency": 9,
            "project_budget": 110000,
            "category": "residential"
        },
        "expected": "win"
    },
    {
        "name": "Fast-Track Infrastructure",
        "features": {
            "bid_total": 400000,
            "materials_cost": 160000,
            "labor_cost": 145000,
            "equipment_cost": 55000,
            "overhead_cost": 40000,
            "timeline_days": 140,
            "profit_margin": 17,
            "roi": 20,
            "contingency": 18,
            "project_budget": 480000,
            "category": "infrastructure"
        },
        "expected": "win"
    },
    {
        "name": "Lean Commercial Operation",
        "features": {
            "bid_total": 65000,
            "materials_cost": 26000,
            "labor_cost": 23000,
            "equipment_cost": 9000,
            "overhead_cost": 7000,
            "timeline_days": 40,
            "profit_margin": 14,
            "roi": 18,
            "contingency": 7,
            "project_budget": 75000,
            "category": "commercial"
        },
        "expected": "win"
    },
    {
        "name": "Luxury Residential Winner",
        "features": {
            "bid_total": 280000,
            "materials_cost": 112000,
            "labor_cost": 100000,
            "equipment_cost": 38000,
            "overhead_cost": 30000,
            "timeline_days": 130,
            "profit_margin": 18,
            "roi": 22,
            "contingency": 20,
            "project_budget": 320000,
            "category": "residential"
        },
        "expected": "win"
    },
    {
        "name": "Strategic Infrastructure Investment",
        "features": {
            "bid_total": 750000,
            "materials_cost": 300000,
            "labor_cost": 270000,
            "equipment_cost": 100000,
            "overhead_cost": 80000,
            "timeline_days": 220,
            "profit_margin": 16,
            "roi": 19,
            "contingency": 25,
            "project_budget": 850000,
            "category": "infrastructure"
        },
        "expected": "win"
    },
    {
        "name": "Compact Commercial Success",
        "features": {
            "bid_total": 55000,
            "materials_cost": 22000,
            "labor_cost": 20000,
            "equipment_cost": 7000,
            "overhead_cost": 6000,
            "timeline_days": 35,
            "profit_margin": 15,
            "roi": 19,
            "contingency": 6,
            "project_budget": 65000,
            "category": "commercial"
        },
        "expected": "win"
    },
    
    {
        "name": "Overpriced Residential Bid",
        "features": {
            "bid_total": 150000,
            "materials_cost": 60000,
            "labor_cost": 50000,
            "equipment_cost": 20000,
            "overhead_cost": 20000,
            "timeline_days": 90,
            "profit_margin": 25,
            "roi": 30,
            "contingency": 15,
            "project_budget": 120000,
            "category": "residential"
        },
        "expected": "loss"
    },
    {
        "name": "Excessive Infrastructure Costs",
        "features": {
            "bid_total": 800000,
            "materials_cost": 350000,
            "labor_cost": 300000,
            "equipment_cost": 100000,
            "overhead_cost": 50000,
            "timeline_days": 300,
            "profit_margin": 28,
            "roi": 35,
            "contingency": 30,
            "project_budget": 600000,
            "category": "infrastructure"
        },
        "expected": "loss"
    },
    {
        "name": "Slow Commercial Project",
        "features": {
            "bid_total": 180000,
            "materials_cost": 80000,
            "labor_cost": 70000,
            "equipment_cost": 20000,
            "overhead_cost": 10000,
            "timeline_days": 200,
            "profit_margin": 22,
            "roi": 28,
            "contingency": 18,
            "project_budget": 150000,
            "category": "commercial"
        },
        "expected": "loss"
    },
    {
        "name": "High-Risk Residential",
        "features": {
            "bid_total": 250000,
            "materials_cost": 120000,
            "labor_cost": 90000,
            "equipment_cost": 25000,
            "overhead_cost": 15000,
            "timeline_days": 150,
            "profit_margin": 30,
            "roi": 38,
            "contingency": 25,
            "project_budget": 180000,
            "category": "residential"
        },
        "expected": "loss"
    },
    {
        "name": "Bloated Infrastructure Bid",
        "features": {
            "bid_total": 1200000,
            "materials_cost": 500000,
            "labor_cost": 450000,
            "equipment_cost": 150000,
            "overhead_cost": 100000,
            "timeline_days": 400,
            "profit_margin": 32,
            "roi": 40,
            "contingency": 35,
            "project_budget": 900000,
            "category": "infrastructure"
        },
        "expected": "loss"
    },
    {
        "name": "Inefficient Commercial Approach",
        "features": {
            "bid_total": 320000,
            "materials_cost": 150000,
            "labor_cost": 120000,
            "equipment_cost": 30000,
            "overhead_cost": 20000,
            "timeline_days": 180,
            "profit_margin": 26,
            "roi": 32,
            "contingency": 22,
            "project_budget": 250000,
            "category": "commercial"
        },
        "expected": "loss"
    },
    {
        "name": "Overambitious Residential",
        "features": {
            "bid_total": 420000,
            "materials_cost": 200000,
            "labor_cost": 150000,
            "equipment_cost": 40000,
            "overhead_cost": 30000,
            "timeline_days": 200,
            "profit_margin": 35,
            "roi": 42,
            "contingency": 30,
            "project_budget": 300000,
            "category": "residential"
        },
        "expected": "loss"
    },
    {
        "name": "Extended Timeline Infrastructure",
        "features": {
            "bid_total": 650000,
            "materials_cost": 280000,
            "labor_cost": 250000,
            "equipment_cost": 80000,
            "overhead_cost": 40000,
            "timeline_days": 350,
            "profit_margin": 24,
            "roi": 29,
            "contingency": 28,
            "project_budget": 500000,
            "category": "infrastructure"
        },
        "expected": "loss"
    },
    {
        "name": "Premium-Priced Commercial",
        "features": {
            "bid_total": 450000,
            "materials_cost": 200000,
            "labor_cost": 170000,
            "equipment_cost": 50000,
            "overhead_cost": 30000,
            "timeline_days": 160,
            "profit_margin": 28,
            "roi": 34,
            "contingency": 25,
            "project_budget": 350000,
            "category": "commercial"
        },
        "expected": "loss"
    },
    {
        "name": "Luxury Residential Overreach",
        "features": {
            "bid_total": 600000,
            "materials_cost": 280000,
            "labor_cost": 220000,
            "equipment_cost": 60000,
            "overhead_cost": 40000,
            "timeline_days": 250,
            "profit_margin": 38,
            "roi": 45,
            "contingency": 35,
            "project_budget": 450000,
            "category": "residential"
        },
        "expected": "loss"
    },
    {
        "name": "Complex Infrastructure Failure",
        "features": {
            "bid_total": 950000,
            "materials_cost": 420000,
            "labor_cost": 350000,
            "equipment_cost": 120000,
            "overhead_cost": 60000,
            "timeline_days": 320,
            "profit_margin": 30,
            "roi": 36,
            "contingency": 40,
            "project_budget": 700000,
            "category": "infrastructure"
        },
        "expected": "loss"
    },
    {
        "name": "Overengineered Commercial",
        "features": {
            "bid_total": 380000,
            "materials_cost": 180000,
            "labor_cost": 140000,
            "equipment_cost": 35000,
            "overhead_cost": 25000,
            "timeline_days": 140,
            "profit_margin": 27,
            "roi": 33,
            "contingency": 20,
            "project_budget": 290000,
            "category": "commercial"
        },
        "expected": "loss"
    },
    {
        "name": "High-Margin Residential Miss",
        "features": {
            "bid_total": 350000,
            "materials_cost": 160000,
            "labor_cost": 130000,
            "equipment_cost": 35000,
            "overhead_cost": 25000,
            "timeline_days": 170,
            "profit_margin": 33,
            "roi": 40,
            "contingency": 28,
            "project_budget": 260000,
            "category": "residential"
        },
        "expected": "loss"
    },
    {
        "name": "Delayed Infrastructure Project",
        "features": {
            "bid_total": 520000,
            "materials_cost": 230000,
            "labor_cost": 200000,
            "equipment_cost": 60000,
            "overhead_cost": 30000,
            "timeline_days": 280,
            "profit_margin": 26,
            "roi": 31,
            "contingency": 24,
            "project_budget": 400000,
            "category": "infrastructure"
        },
        "expected": "loss"
    },
    {
        "name": "Expensive Commercial Venture",
        "features": {
            "bid_total": 280000,
            "materials_cost": 130000,
            "labor_cost": 110000,
            "equipment_cost": 25000,
            "overhead_cost": 15000,
            "timeline_days": 120,
            "profit_margin": 25,
            "roi": 30,
            "contingency": 18,
            "project_budget": 220000,
            "category": "commercial"
        },
        "expected": "loss"
    },
    {
        "name": "Unrealistic Residential Expectations",
        "features": {
            "bid_total": 480000,
            "materials_cost": 220000,
            "labor_cost": 180000,
            "equipment_cost": 50000,
            "overhead_cost": 30000,
            "timeline_days": 210,
            "profit_margin": 36,
            "roi": 43,
            "contingency": 32,
            "project_budget": 350000,
            "category": "residential"
        },
        "expected": "loss"
    },
    {
        "name": "Mega Infrastructure Miscalculation",
        "features": {
            "bid_total": 1500000,
            "materials_cost": 650000,
            "labor_cost": 550000,
            "equipment_cost": 200000,
            "overhead_cost": 100000,
            "timeline_days": 450,
            "profit_margin": 40,
            "roi": 48,
            "contingency": 50,
            "project_budget": 1000000,
            "category": "infrastructure"
        },
        "expected": "loss"
    }
]

def test_model():
    url = "http://localhost:8000/predict"
    
    print("Testing ML Model with 33 Comprehensive Test Cases...")
    print("=" * 60)
    print(f"Total Cases: {len(test_cases)}")
    
    wins = sum(1 for case in test_cases if case['expected'] == 'win')
    losses = sum(1 for case in test_cases if case['expected'] == 'loss')
    print(f"Expected Wins: {wins}, Expected Losses: {losses}")
    print("=" * 60)
    
    correct_predictions = 0
    total_predictions = 0
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}: {test_case['name']}")
        print(f"Expected: {test_case['expected'].upper()}")
        print("-" * 40)
        
        try:
            response = requests.post(url, json={"features": test_case["features"]})
            
            if response.status_code == 200:
                result = response.json()
                prediction_label = 'win' if result['prediction'] == 1 else 'loss'
                is_correct = prediction_label == test_case['expected']
                
                if is_correct:
                    correct_predictions += 1
                total_predictions += 1
                
                status = "✅ CORRECT" if is_correct else "❌ INCORRECT"
                print(f"{status}")
                print(f"   Predicted: {prediction_label.upper()} ({'Won' if result['prediction'] == 1 else 'Lost'})")
                print(f"   Probability: {result['probability']:.2%}")
                print(f"   Bid Total: ${test_case['features']['bid_total']:,}")
                print(f"   Category: {test_case['features']['category'].title()}")
                
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection Error: Make sure the ML API server is running on port 8000")
            print("   Start server with: uvicorn main:app --reload --port 8000")
            break
        except Exception as e:
            print(f"❌ Unexpected Error: {e}")
    
    # Summary
    if total_predictions > 0:
        accuracy = (correct_predictions / total_predictions) * 100
        print("\n" + "=" * 60)
        print("TESTING SUMMARY")
        print("=" * 60)
        print(f"Total Test Cases: {len(test_cases)}")
        print(f"Successfully Tested: {total_predictions}")
        print(f"Correct Predictions: {correct_predictions}")
        print(f"Model Accuracy: {accuracy:.1f}%")
        print(f"Expected Win Cases: {wins}")
        print(f"Expected Loss Cases: {losses}")

if __name__ == "__main__":
    test_model()