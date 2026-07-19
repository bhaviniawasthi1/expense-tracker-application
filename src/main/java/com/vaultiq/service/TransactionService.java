package com.vaultiq.service;

import com.vaultiq.model.Transaction;
import com.vaultiq.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class TransactionService {

    private final TransactionRepository repo;

    public TransactionService(TransactionRepository repo) {
        this.repo = repo;
    }

    public List<Transaction> getAll() {
        return repo.findAllByOrderByDateDesc();
    }

    public Transaction getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NoSuchElementException("Transaction not found"));
    }

    public Transaction create(Transaction transaction) {
        return repo.save(transaction);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Map<String, Object> getReport() {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalIncome", repo.totalIncome());
        report.put("totalExpense", repo.totalExpense());

        List<Map<String, Object>> breakdown = new ArrayList<>();
        for (Object[] row : repo.expenseByCategory()) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("category", row[0]);
            entry.put("amount", row[1]);
            breakdown.add(entry);
        }
        report.put("expenseByCategory", breakdown);
        return report;
    }
}
