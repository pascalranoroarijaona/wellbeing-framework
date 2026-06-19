import hashlib
import json
import time
from datetime import datetime

class BiologicalS2FLedger:
    """
    A decentralized ledger module for tracking the Stock-to-Flow (S2F) 
    of biological species using the 'Sun Standard' (Emergy / seJ).
    """
    
    def __init__(self):
        # Multi-cloud regional data aggregators
        self.regions = {
            "aws_americas": [],
            "alibaba_asia": [],
            "ovh_europe": [],
            "teraco_africa": []
        }
        self.state_history = []

    def add_species_data(self, region, species_name, population_stock, annual_growth, annual_anthropogenic_extraction, emergy_per_unit):
        """
        Logs species data into the designated regional cloud node.
        emergy_per_unit: Solar equivalent Joules (seJ) embedded in one unit of the species.
        """
        if region not in self.regions:
            raise ValueError(f"Unknown geographical node: {region}")
            
        data_entry = {
            "species": species_name,
            "stock": population_stock,
            "natural_flow": annual_growth,
            "extraction_flow": annual_anthropogenic_extraction,
            "emergy_seJ": emergy_per_unit,
            "timestamp": time.time()
        }
        self.regions[region].append(data_entry)

    def calculate_global_s2f(self):
        """
        Calculates the thermodynamic Stock-to-Flow ratio across all nodes.
        S2F = (Total Biological Stock * seJ) / (Total Anthropogenic Extraction * seJ)
        """
        total_stock_seJ = 0.0
        total_extraction_seJ = 0.0
        
        for region, records in self.regions.items():
            for record in records:
                stock_value = record["stock"] * record["emergy_seJ"]
                extraction_value = record["extraction_flow"] * record["emergy_seJ"]
                
                total_stock_seJ += stock_value
                total_extraction_seJ += extraction_value
                
        if total_extraction_seJ == 0:
            return float('inf') # Infinite S2F if no anthropogenic extraction
            
        return total_stock_seJ / total_extraction_seJ

    def generate_cryptographic_state_anchor(self):
        """
        Aggregates the current planetary boundaries into a single JSON string,
        hashes it via SHA-256, and prepares it for Nostr/OpenTimestamps broadcast.
        """
        current_s2f = self.calculate_global_s2f()
        
        state_snapshot = {
            "date": datetime.utcnow().isoformat(),
            "global_thermodynamic_s2f": current_s2f,
            "regional_node_status": {k: len(v) for k, v in self.regions.items()},
        }
        
        # Create deterministic JSON string for hashing
        state_string = json.dumps(state_snapshot, sort_keys=True)
        state_hash = hashlib.sha256(state_string.encode('utf-8')).hexdigest()
        
        anchor = {
            "snapshot": state_snapshot,
            "sha256_hash": state_hash,
            "protocol": "D-Trinity/Nostr Compatible"
        }
        
        self.state_history.append(anchor)
        return anchor

# ==========================================
# Example Usage / Local Testing
# ==========================================
if __name__ == "__main__":
    ledger = BiologicalS2FLedger()
    
    # Simulating data ingestion across geopolitical nodes
    ledger.add_species_data("aws_americas", "Amazonian_Mahogany", population_stock=500000, annual_growth=10000, annual_anthropogenic_extraction=15000, emergy_per_unit=4.5e15)
    ledger.add_species_data("alibaba_asia", "Bluefin_Tuna", population_stock=1500000, annual_growth=200000, annual_anthropogenic_extraction=250000, emergy_per_unit=2.1e14)
    ledger.add_species_data("teraco_africa", "African_Forest_Elephant", population_stock=40000, annual_growth=1500, annual_anthropogenic_extraction=500, emergy_per_unit=8.9e16)
    ledger.add_species_data("ovh_europe", "Baltic_Cod", population_stock=80000000, annual_growth=15000000, annual_anthropogenic_extraction=12000000, emergy_per_unit=1.2e13)

    print("--- Wellbeing Framework: Global S2F Ledger ---")
    current_s2f = ledger.calculate_global_s2f()
    print(f"Global Thermodynamic S2F Ratio: {current_s2f:.2f}")
    
    if current_s2f < 50:
         print("WARNING: Global biological scarcity detected. S2F below thermodynamic parity.")
         
    anchor = ledger.generate_cryptographic_state_anchor()
    print("\n--- Cryptographic State Anchor (SHA-256) ---")
    print(f"State Hash: {anchor['sha256_hash']}")
    print("Ready for OpenTimestamps broadcast.")